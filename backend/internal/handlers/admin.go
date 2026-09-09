package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"eventify-backend/internal/auth"
	"eventify-backend/internal/models"
	"eventify-backend/internal/store"
)

type AdminHandler struct {
	store *store.Store
}

func NewAdminHandler(store *store.Store) *AdminHandler {
	return &AdminHandler{
		store: store,
	}
}

type CreateAdminRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UpdateAdminRequest struct {
	Username string `json:"username"`
}

type ChangePasswordRequest struct {
	Password string `json:"password"`
}

type AdminResponse struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

func toAdminResponse(
	admin *models.Admin,
) AdminResponse {
	return AdminResponse{
		ID:        admin.ID,
		Username:  admin.Username,
		IsActive:  admin.IsActive,
		CreatedAt: admin.CreatedAt.Format(time.RFC3339),
		UpdatedAt: admin.UpdatedAt.Format(time.RFC3339),
	}
}

func (h *AdminHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	admins, err := h.store.ListAdmins(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to retrieve admins",
			http.StatusInternalServerError,
		)
		return
	}

	response := make(
		[]AdminResponse,
		0,
		len(admins),
	)

	for i := range admins {
		response = append(
			response,
			toAdminResponse(&admins[i]),
		)
	}

	writeJSON(
		w,
		http.StatusOK,
		response,
	)
}

func (h *AdminHandler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request CreateAdminRequest

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

	request.Username = strings.TrimSpace(
		request.Username,
	)

	if request.Username == "" {
		http.Error(
			w,
			"username is required",
			http.StatusBadRequest,
		)
		return
	}

	if len(request.Password) < 8 {
		http.Error(
			w,
			"password must be at least 8 characters",
			http.StatusBadRequest,
		)
		return
	}

	existingAdmin, err := h.store.GetAdminByUsername(
		r.Context(),
		request.Username,
	)
	if err != nil {
		http.Error(
			w,
			"failed to check username",
			http.StatusInternalServerError,
		)
		return
	}

	if existingAdmin != nil {
		http.Error(
			w,
			"username already exists",
			http.StatusConflict,
		)
		return
	}

	passwordHash, err := auth.HashPassword(
		request.Password,
	)
	if err != nil {
		http.Error(
			w,
			"failed to hash password",
			http.StatusInternalServerError,
		)
		return
	}

	admin, err := h.store.CreateAdmin(
		r.Context(),
		request.Username,
		passwordHash,
	)
	if err != nil {
		http.Error(
			w,
			"failed to create admin",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		toAdminResponse(admin),
	)
}

func (h *AdminHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid admin id",
			http.StatusBadRequest,
		)
		return
	}

	var request UpdateAdminRequest

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

	request.Username = strings.TrimSpace(
		request.Username,
	)

	if request.Username == "" {
		http.Error(
			w,
			"username is required",
			http.StatusBadRequest,
		)
		return
	}

	existingAdmin, err := h.store.GetAdminByUsername(
		r.Context(),
		request.Username,
	)
	if err != nil {
		http.Error(
			w,
			"failed to check username",
			http.StatusInternalServerError,
		)
		return
	}

	if existingAdmin != nil &&
		existingAdmin.ID != id {
		http.Error(
			w,
			"username already exists",
			http.StatusConflict,
		)
		return
	}

	admin, err := h.store.UpdateAdmin(
		r.Context(),
		id,
		request.Username,
	)
	if err != nil {
		http.Error(
			w,
			"failed to update admin",
			http.StatusInternalServerError,
		)
		return
	}

	if admin == nil {
		http.Error(
			w,
			"admin not found",
			http.StatusNotFound,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		toAdminResponse(admin),
	)
}

func (h *AdminHandler) ChangePassword(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid admin id",
			http.StatusBadRequest,
		)
		return
	}

	var request ChangePasswordRequest

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

	if len(request.Password) < 8 {
		http.Error(
			w,
			"password must be at least 8 characters",
			http.StatusBadRequest,
		)
		return
	}

	passwordHash, err := auth.HashPassword(
		request.Password,
	)
	if err != nil {
		http.Error(
			w,
			"failed to hash password",
			http.StatusInternalServerError,
		)
		return
	}

	if err := h.store.UpdateAdminPassword(
		r.Context(),
		id,
		passwordHash,
	); err != nil {
		if err == store.ErrNotFound {
			http.Error(
				w,
				"admin not found",
				http.StatusNotFound,
			)
			return
		}

		http.Error(
			w,
			"failed to update password",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AdminHandler) Disable(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := strconv.Atoi(
		r.PathValue("id"),
	)
	if err != nil {
		http.Error(
			w,
			"invalid admin id",
			http.StatusBadRequest,
		)
		return
	}

	if err := h.store.DisableAdmin(
		r.Context(),
		id,
	); err != nil {
		if err == store.ErrNotFound {
			http.Error(
				w,
				"admin not found",
				http.StatusNotFound,
			)
			return
		}

		http.Error(
			w,
			"failed to disable admin",
			http.StatusInternalServerError,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
