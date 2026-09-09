package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"eventify-backend/internal/store"
)

type ServiceHandler struct {
	store *store.Store
}

func NewServiceHandler(store *store.Store) *ServiceHandler {
	return &ServiceHandler{
		store: store,
	}
}

type ServiceResponse struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

type ServiceRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func (h *ServiceHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	services, err := h.store.ListServices(r.Context())
	if err != nil {
		http.Error(
			w,
			"failed to retrieve services",
			http.StatusInternalServerError,
		)
		return
	}

	servicesResponse := make(
		[]ServiceResponse,
		0,
		len(services),
	)

	for _, service := range services {
		servicesResponse = append(
			servicesResponse,
			ServiceResponse{
				ID:          service.ID,
				Name:        service.Name,
				Description: service.Description,
				Price:       service.Price,
			},
		)
	}

	writeJSON(
		w,
		http.StatusOK,
		servicesResponse,
	)
}

func (h *ServiceHandler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request ServiceRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
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

	service, err := h.store.CreateService(
		r.Context(),
		request.Name,
		request.Description,
		request.Price,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create service",
			http.StatusInternalServerError,
		)
		return
	}

	response := ServiceResponse{
		ID:          service.ID,
		Name:        service.Name,
		Description: service.Description,
		Price:       service.Price,
	}

	writeJSON(
		w,
		http.StatusCreated,
		response,
	)
}

func (h *ServiceHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := serviceIDFromPath(r)
	if err != nil {
		http.Error(
			w,
			"invalid service id",
			http.StatusBadRequest,
		)
		return
	}

	var request ServiceRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
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

	service, err := h.store.UpdateService(
		r.Context(),
		id,
		request.Name,
		request.Description,
		request.Price,
	)
	if err != nil {
		http.Error(
			w,
			"failed to update service",
			http.StatusInternalServerError,
		)
		return
	}

	if service == nil {
		http.Error(
			w,
			"service not found",
			http.StatusNotFound,
		)
		return
	}

	response := ServiceResponse{
		ID:          service.ID,
		Name:        service.Name,
		Description: service.Description,
		Price:       service.Price,
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *ServiceHandler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := serviceIDFromPath(r)
	if err != nil {
		http.Error(
			w,
			"invalid service id",
			http.StatusBadRequest,
		)
		return
	}

	err = h.store.DeleteService(
		r.Context(),
		id,
	)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			http.Error(
				w,
				"service not found",
				http.StatusNotFound,
			)
			return
		}

		http.Error(
			w,
			"failed to delete service",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func serviceIDFromPath(
	r *http.Request,
) (int, error) {
	idString := r.PathValue("id")

	return strconv.Atoi(idString)
}
