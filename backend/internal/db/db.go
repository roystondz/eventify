package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

func Open(path string) (*sql.DB, error) {
	database, err := sql.Open("sqlite3", path)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	if err := database.Ping(); err != nil {
		return nil, fmt.Errorf("ping database: %w", err)
	}

	return database, nil
}
