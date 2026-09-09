package store

import (
	"database/sql"
	"errors"
)

var ErrNotFound = errors.New("record not found")

type Store struct {
	db *sql.DB
}

func New(db *sql.DB) *Store {
	return &Store{
		db: db,
	}
}
