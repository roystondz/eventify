package store

import (
	"context"
	"database/sql"
	"fmt"

	"eventify-backend/internal/models"
)

func (s *Store) ListServices(ctx context.Context) ([]models.Service, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			created_at,
			updated_at
		FROM services
		ORDER BY id ASC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list services: %w", err)
	}
	defer rows.Close()

	services := make([]models.Service, 0)

	for rows.Next() {
		var service models.Service

		err := rows.Scan(
			&service.ID,
			&service.Name,
			&service.Description,
			&service.Price,
			&service.CreatedAt,
			&service.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan service: %w", err)
		}

		services = append(services, service)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate services: %w", err)
	}

	return services, nil
}

func (s *Store) GetService(
	ctx context.Context,
	id int,
) (*models.Service, error) {
	const query = `
		SELECT
			id,
			name,
			description,
			price,
			created_at,
			updated_at
		FROM services
		WHERE id = ?
	`

	var service models.Service

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&service.ID,
		&service.Name,
		&service.Description,
		&service.Price,
		&service.CreatedAt,
		&service.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf("get service: %w", err)
	}

	return &service, nil
}

func (s *Store) CreateService(
	ctx context.Context,
	name string,
	description string,
	price float64,
) (*models.Service, error) {
	const query = `
		INSERT INTO services (
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
		return nil, fmt.Errorf("create service: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("get created service id: %w", err)
	}

	return s.GetService(ctx, int(id))
}

func (s *Store) UpdateService(
	ctx context.Context,
	id int,
	name string,
	description string,
	price float64,
) (*models.Service, error) {
	const query = `
		UPDATE services
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
		return nil, fmt.Errorf("update service: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("check updated service: %w", err)
	}

	if rowsAffected == 0 {
		return nil, nil
	}

	return s.GetService(ctx, id)
}

func (s *Store) DeleteService(
	ctx context.Context,
	id int,
) error {
	const query = `
		DELETE FROM services
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		id,
	)
	if err != nil {
		return fmt.Errorf("delete service: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("check deleted service: %w", err)
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}