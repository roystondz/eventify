package store

import (
	"context"
	"database/sql"
	"fmt"

	"eventify-backend/internal/models"
)

func (s *Store) GetSettings(
	ctx context.Context,
) ([]models.Setting, error) {

	const query = `
		SELECT
			key,
			value,
			updated_at
		FROM settings
		ORDER BY key ASC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("get settings: %w", err)
	}
	defer rows.Close()

	settings := make([]models.Setting, 0)

	for rows.Next() {
		var setting models.Setting

		err := rows.Scan(
			&setting.Key,
			&setting.Value,
			&setting.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan setting: %w", err)
		}

		settings = append(settings, setting)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate settings: %w", err)
	}

	return settings, nil
}

func (s *Store) GetSetting(
	ctx context.Context,
	key string,
) (*models.Setting, error) {

	const query = `
		SELECT
			key,
			value,
			updated_at
		FROM settings
		WHERE key = ?
	`

	var setting models.Setting

	err := s.db.QueryRowContext(
		ctx,
		query,
		key,
	).Scan(
		&setting.Key,
		&setting.Value,
		&setting.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf("get setting: %w", err)
	}

	return &setting, nil
}

func (s *Store) UpsertSetting(
	ctx context.Context,
	key string,
	value string,
) (*models.Setting, error) {

	const query = `
		INSERT INTO settings (
			key,
			value,
			updated_at
		)
		VALUES (?, ?, CURRENT_TIMESTAMP)
		ON CONFLICT(key)
		DO UPDATE SET
			value = excluded.value,
			updated_at = CURRENT_TIMESTAMP
	`

	_, err := s.db.ExecContext(
		ctx,
		query,
		key,
		value,
	)

	if err != nil {
		return nil, fmt.Errorf("upsert setting: %w", err)
	}

	return s.GetSetting(ctx, key)
}
