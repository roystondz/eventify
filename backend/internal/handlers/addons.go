package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"eventify-backend/internal/store"
)

type AddonHandler struct {
	store *store.Store
}

func NewAddonHandler(store *store.Store) *AddonHandler {
	return &AddonHandler{
		store: store,
	}
}

type AddonRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

type AddonResponse struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func (h *AddonHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	addons, err := h.store.ListAddons(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to retrieve addons",
			http.StatusInternalServerError,
		)
		return
	}

	response := make(
		[]AddonResponse,
		0,
		len(addons),
	)

	for _, addon := range addons {
		response = append(
			response,
			AddonResponse{
				ID:          addon.ID,
				Name:        addon.Name,
				Description: addon.Description,
				Price:       addon.Price,
			},
		)
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *AddonHandler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request AddonRequest

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

	addon, err := h.store.CreateAddon(
		r.Context(),
		request.Name,
		request.Description,
		request.Price,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create addon",
			http.StatusInternalServerError,
		)
		return
	}

	response := AddonResponse{
		ID:          addon.ID,
		Name:        addon.Name,
		Description: addon.Description,
		Price:       addon.Price,
	}

	writeJSON(
		w,
		http.StatusCreated,
		response,
	)
}

func (h *AddonHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid addon id",
			http.StatusBadRequest,
		)
		return
	}

	var request AddonRequest

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

	addon, err := h.store.UpdateAddon(
		r.Context(),
		id,
		request.Name,
		request.Description,
		request.Price,
	)
	if err != nil {
		http.Error(
			w,
			"failed to update addon",
			http.StatusInternalServerError,
		)
		return
	}

	if addon == nil {
		http.Error(
			w,
			"addon not found",
			http.StatusNotFound,
		)
		return
	}

	response := AddonResponse{
		ID:          addon.ID,
		Name:        addon.Name,
		Description: addon.Description,
		Price:       addon.Price,
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *AddonHandler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid addon id",
			http.StatusBadRequest,
		)
		return
	}

	if err := h.store.DeleteAddon(
		r.Context(),
		id,
	); err != nil {
		if err == store.ErrNotFound {
			http.Error(
				w,
				"addon not found",
				http.StatusNotFound,
			)
			return
		}

		http.Error(
			w,
			"failed to delete addon",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
