package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"eventify-backend/internal/models"
)

func (s *Store) ListPackages(
	ctx context.Context,
) ([]models.Package, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			items,
			savings,
			created_at,
			updated_at
		FROM packages
		ORDER BY id ASC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list packages: %w", err)
	}
	defer rows.Close()

	packages := make([]models.Package, 0)

	for rows.Next() {
		var pkg models.Package
		var itemsJSON string

		err := rows.Scan(
			&pkg.ID,
			&pkg.Name,
			&pkg.Description,
			&pkg.Price,
			&itemsJSON,
			&pkg.Savings,
			&pkg.CreatedAt,
			&pkg.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan package: %w", err)
		}

		if err := json.Unmarshal(
			[]byte(itemsJSON),
			&pkg.Items,
		); err != nil {
			return nil, fmt.Errorf("decode package items: %w", err)
		}

		packages = append(packages, pkg)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate packages: %w", err)
	}

	return packages, nil
}

func (s *Store) GetPackage(
	ctx context.Context,
	id int,
) (*models.Package, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			items,
			savings,
			created_at,
			updated_at
		FROM packages
		WHERE id = ?
	`

	var pkg models.Package
	var itemsJSON string

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&pkg.ID,
		&pkg.Name,
		&pkg.Description,
		&pkg.Price,
		&itemsJSON,
		&pkg.Savings,
		&pkg.CreatedAt,
		&pkg.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf("get package: %w", err)
	}

	if err := json.Unmarshal(
		[]byte(itemsJSON),
		&pkg.Items,
	); err != nil {
		return nil, fmt.Errorf("decode package items: %w", err)
	}

	return &pkg, nil
}

func (s *Store) CreatePackage(
	ctx context.Context,
	name string,
	description string,
	price float64,
	items []string,
	savings string,
) (*models.Package, error) {
	itemsJSON, err := json.Marshal(items)
	if err != nil {
		return nil, fmt.Errorf("encode package items: %w", err)
	}

	const query = `
		INSERT INTO packages (
			name,
			description,
			price,
			items,
			savings
		)
		VALUES (?, ?, ?, ?, ?)
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		name,
		description,
		price,
		string(itemsJSON),
		savings,
	)
	if err != nil {
		return nil, fmt.Errorf("create package: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("get created package id: %w", err)
	}

	return s.GetPackage(ctx, int(id))
}

func (s *Store) UpdatePackage(
	ctx context.Context,
	id int,
	name string,
	description string,
	price float64,
	items []string,
	savings string,
) (*models.Package, error) {
	itemsJSON, err := json.Marshal(items)
	if err != nil {
		return nil, fmt.Errorf("encode package items: %w", err)
	}

	const query = `
		UPDATE packages
		SET
			name = ?,
			description = ?,
			price = ?,
			items = ?,
			savings = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		name,
		description,
		price,
		string(itemsJSON),
		savings,
		id,
	)
	if err != nil {
		return nil, fmt.Errorf("update package: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("check updated package: %w", err)
	}

	if rowsAffected == 0 {
		return nil, nil
	}

	return s.GetPackage(ctx, id)
}

func (s *Store) DeletePackage(
	ctx context.Context,
	id int,
) error {
	const query = `
		DELETE FROM packages
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		id,
	)
	if err != nil {
		return fmt.Errorf("delete package: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("check deleted package: %w", err)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
