package store

import (
	"context"
	"database/sql"
	"fmt"

	"eventify-backend/internal/models"
)

func (s *Store) ListAddons(
	ctx context.Context,
) ([]models.Addon, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			created_at,
			updated_at
		FROM addons
		ORDER BY id ASC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list addons: %w", err)
	}
	defer rows.Close()

	addons := make([]models.Addon, 0)

	for rows.Next() {
		var addon models.Addon

		err := rows.Scan(
			&addon.ID,
			&addon.Name,
			&addon.Description,
			&addon.Price,
			&addon.CreatedAt,
			&addon.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan addon: %w", err)
		}

		addons = append(addons, addon)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate addons: %w", err)
	}

	return addons, nil
}

func (s *Store) GetAddon(
	ctx context.Context,
	id int,
) (*models.Addon, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			created_at,
			updated_at
		FROM addons
		WHERE id = ?
	`

	var addon models.Addon

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&addon.ID,
		&addon.Name,
		&addon.Description,
		&addon.Price,
		&addon.CreatedAt,
		&addon.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf("get addon: %w", err)
	}

	return &addon, nil
}

func (s *Store) CreateAddon(
	ctx context.Context,
	name string,
	description string,
	price float64,
) (*models.Addon, error) {
	const query = `
		INSERT INTO addons (
			name,
			description,
			price
		)
		VALUES (?, ?, ?)
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		name,
		description,
		price,
	)
	if err != nil {
		return nil, fmt.Errorf("create addon: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("get created addon id: %w", err)
	}

	return s.GetAddon(ctx, int(id))
}

func (s *Store) UpdateAddon(
	ctx context.Context,
	id int,
	name string,
	description string,
	price float64,
) (*models.Addon, error) {
	const query = `
		UPDATE addons
		SET
			name = ?,
			description = ?,
			price = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		name,
		description,
		price,
		id,
	)
	if err != nil {
		return nil, fmt.Errorf("update addon: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("check updated addon: %w", err)
	}

	if rowsAffected == 0 {
		return nil, nil
	}

	return s.GetAddon(ctx, id)
}

func (s *Store) DeleteAddon(
	ctx context.Context,
	id int,
) error {
	const query = `
		DELETE FROM addons
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		id,
	)
	if err != nil {
		return fmt.Errorf("delete addon: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("check deleted addon: %w", err)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
