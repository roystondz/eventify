package db

import (
	"database/sql"
	"embed"
	"fmt"
)

//go:embed migrations/*.sql
var migrationFiles embed.FS

type migration struct {
	Version int
	Name    string
	SQL     string
}

var migrations = []migration{
	{
		Version: 1,
		Name:    "initial_schema",
		SQL:     mustReadMigration("migrations/0001_init.sql"),
	},
}

func mustReadMigration(path string) string {
	data, err := migrationFiles.ReadFile(path)
	if err != nil {
		panic(fmt.Sprintf(
			"failed to read migration %s: %v",
			path,
			err,
		))
	}

	return string(data)
}

func Migrate(db *sql.DB) error {
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INTEGER PRIMARY KEY,
			applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		)
	`); err != nil {
		return fmt.Errorf(
			"create schema_migrations table: %w",
			err,
		)
	}

	for _, migration := range migrations {
		var exists int

		err := db.QueryRow(
			`SELECT COUNT(*) FROM schema_migrations WHERE version = ?`,
			migration.Version,
		).Scan(&exists)

		if err != nil {
			return fmt.Errorf(
				"check migration %d: %w",
				migration.Version,
				err,
			)
		}

		if exists > 0 {
			continue
		}

		tx, err := db.Begin()
		if err != nil {
			return fmt.Errorf(
				"begin migration %d: %w",
				migration.Version,
				err,
			)
		}

		if _, err := tx.Exec(migration.SQL); err != nil {
			_ = tx.Rollback()

			return fmt.Errorf(
				"execute migration %d: %w",
				migration.Version,
				err,
			)
		}

		if _, err := tx.Exec(
			`INSERT INTO schema_migrations (version) VALUES (?)`,
			migration.Version,
		); err != nil {
			_ = tx.Rollback()

			return fmt.Errorf(
				"record migration %d: %w",
				migration.Version,
				err,
			)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf(
				"commit migration %d: %w",
				migration.Version,
				err,
			)
		}
	}

	return nil
}
