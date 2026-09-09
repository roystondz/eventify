package store

import (
	"context"
	"database/sql"
	"fmt"

	"eventify-backend/internal/models"
)

func (s *Store) GetAdminByUsername(
	ctx context.Context,
	username string,
) (*models.Admin, error) {
	const query = `
		SELECT
			id,
			username,
			password_hash,
			is_active,
			created_at,
			updated_at
		FROM admins
		WHERE username = ?
	`

	var admin models.Admin

	err := s.db.QueryRowContext(
		ctx,
		query,
		username,
	).Scan(
		&admin.ID,
		&admin.Username,
		&admin.PasswordHash,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf(
			"get admin by username: %w",
			err,
		)
	}

	return &admin, nil
}

func (s *Store) ListAdmins(
	ctx context.Context,
) ([]models.Admin, error) {
	const query = `
		SELECT
			id,
			username,
			password_hash,
			is_active,
			created_at,
			updated_at
		FROM admins
		ORDER BY id ASC
	`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf(
			"list admins: %w",
			err,
		)
	}
	defer rows.Close()

	admins := make([]models.Admin, 0)

	for rows.Next() {
		var admin models.Admin

		err := rows.Scan(
			&admin.ID,
			&admin.Username,
			&admin.PasswordHash,
			&admin.IsActive,
			&admin.CreatedAt,
			&admin.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf(
				"scan admin: %w",
				err,
			)
		}

		admins = append(admins, admin)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf(
			"iterate admins: %w",
			err,
		)
	}

	return admins, nil
}

func (s *Store) GetAdmin(
	ctx context.Context,
	id int,
) (*models.Admin, error) {
	const query = `
		SELECT
			id,
			username,
			password_hash,
			is_active,
			created_at,
			updated_at
		FROM admins
		WHERE id = ?
	`

	var admin models.Admin

	err := s.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&admin.ID,
		&admin.Username,
		&admin.PasswordHash,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf(
			"get admin: %w",
			err,
		)
	}

	return &admin, nil
}

func (s *Store) CreateAdmin(
	ctx context.Context,
	username string,
	passwordHash string,
) (*models.Admin, error) {
	const query = `
		INSERT INTO admins (
			username,
			password_hash,
			is_active
		)
		VALUES (?, ?, 1)
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		username,
		passwordHash,
	)
	if err != nil {
		return nil, fmt.Errorf(
			"create admin: %w",
			err,
		)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf(
			"get created admin id: %w",
			err,
		)
	}

	return s.GetAdmin(ctx, int(id))
}

func (s *Store) UpdateAdmin(
	ctx context.Context,
	id int,
	username string,
) (*models.Admin, error) {
	const query = `
		UPDATE admins
		SET
			username = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		username,
		id,
	)
	if err != nil {
		return nil, fmt.Errorf(
			"update admin: %w",
			err,
		)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf(
			"check updated admin: %w",
			err,
		)
	}

	if rowsAffected == 0 {
		return nil, nil
	}

	return s.GetAdmin(ctx, id)
}

func (s *Store) UpdateAdminPassword(
	ctx context.Context,
	id int,
	passwordHash string,
) error {
	const query = `
		UPDATE admins
		SET
			password_hash = ?,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		passwordHash,
		id,
	)
	if err != nil {
		return fmt.Errorf(
			"update admin password: %w",
			err,
		)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf(
			"check updated admin password: %w",
			err,
		)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *Store) DisableAdmin(
	ctx context.Context,
	id int,
) error {
	const query = `
		UPDATE admins
		SET
			is_active = 0,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`

	result, err := s.db.ExecContext(
		ctx,
		query,
		id,
	)
	if err != nil {
		return fmt.Errorf(
			"disable admin: %w",
			err,
		)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf(
			"check disabled admin: %w",
			err,
		)
	}

	if rowsAffected == 0 {
		return ErrNotFound
	}

	return nil
}
