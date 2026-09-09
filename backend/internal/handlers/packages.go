package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"eventify-backend/internal/store"
)

type PackageHandler struct {
	store *store.Store
}

func NewPackageHandler(store *store.Store) *PackageHandler {
	return &PackageHandler{
		store: store,
	}
}

type PackageRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Items       []string `json:"items"`
	Savings     string   `json:"savings"`
}

type PackageResponse struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Items       []string `json:"items"`
	Savings     string   `json:"savings"`
}

func (h *PackageHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	packages, err := h.store.ListPackages(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to retrieve packages",
			http.StatusInternalServerError,
		)
		return
	}

	response := make(
		[]PackageResponse,
		0,
		len(packages),
	)

	for _, pkg := range packages {
		response = append(
			response,
			PackageResponse{
				ID:          pkg.ID,
				Name:        pkg.Name,
				Description: pkg.Description,
				Price:       pkg.Price,
				Items:       pkg.Items,
				Savings:     pkg.Savings,
			},
		)
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *PackageHandler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request PackageRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&request); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Description = strings.TrimSpace(request.Description)
	request.Savings = strings.TrimSpace(request.Savings)

	if request.Name == "" {
		http.Error(
			w,
			"name is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.Price < 0 {
		http.Error(
			w,
			"price cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	pkg, err := h.store.CreatePackage(
		r.Context(),
		request.Name,
		request.Description,
		request.Price,
		request.Items,
		request.Savings,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create package",
			http.StatusInternalServerError,
		)
		return
	}

	response := PackageResponse{
		ID:          pkg.ID,
		Name:        pkg.Name,
		Description: pkg.Description,
		Price:       pkg.Price,
		Items:       pkg.Items,
		Savings:     pkg.Savings,
	}

	writeJSON(
		w,
		http.StatusCreated,
		response,
	)
}

func (h *PackageHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid package id",
			http.StatusBadRequest,
		)
		return
	}

	var request PackageRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&request); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Description = strings.TrimSpace(request.Description)
	request.Savings = strings.TrimSpace(request.Savings)

	if request.Name == "" {
		http.Error(
			w,
			"name is required",
			http.StatusBadRequest,
		)
		return
	}

	if request.Price < 0 {
		http.Error(
			w,
			"price cannot be negative",
			http.StatusBadRequest,
		)
		return
	}

	pkg, err := h.store.UpdatePackage(
		r.Context(),
		id,
		request.Name,
		request.Description,
		request.Price,
		request.Items,
		request.Savings,
	)
	if err != nil {
		http.Error(
			w,
			"failed to update package",
			http.StatusInternalServerError,
		)
		return
	}

	if pkg == nil {
		http.Error(
			w,
			"package not found",
			http.StatusNotFound,
		)
		return
	}

	response := PackageResponse{
		ID:          pkg.ID,
		Name:        pkg.Name,
		Description: pkg.Description,
		Price:       pkg.Price,
		Items:       pkg.Items,
		Savings:     pkg.Savings,
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *PackageHandler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid package id",
			http.StatusBadRequest,
		)
		return
	}

	if err := h.store.DeletePackage(
		r.Context(),
		id,
	); err != nil {
		if err == store.ErrNotFound {
			http.Error(
				w,
				"package not found",
				http.StatusNotFound,
			)
			return
		}

		http.Error(
			w,
			"failed to delete package",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
