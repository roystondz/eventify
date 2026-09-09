package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"eventify-backend/internal/auth"
	"eventify-backend/internal/store"
)

type AuthHandler struct {
	store     *store.Store
	jwtSecret string
}

func NewAuthHandler(
	store *store.Store,
	jwtSecret string,
) *AuthHandler {
	return &AuthHandler{
		store:     store,
		jwtSecret: jwtSecret,
	}
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (h *AuthHandler) Login(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		http.Error(
			w,
			"method not allowed",
			http.StatusMethodNotAllowed,
		)
		return
	}

	var request LoginRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	request.Username = strings.TrimSpace(request.Username)

	if request.Username == "" || request.Password == "" {
		http.Error(
			w,
			"username and password are required",
			http.StatusBadRequest,
		)
		return
	}

	admin, err := h.store.GetAdminByUsername(
		r.Context(),
		request.Username,
	)
	if err != nil {
		http.Error(
			w,
			"internal server error",
			http.StatusInternalServerError,
		)
		return
	}

	// Don't reveal whether the username exists.
	if admin == nil {
		http.Error(
			w,
			"invalid credentials",
			http.StatusUnauthorized,
		)
		return
	}

	if !admin.IsActive {
		http.Error(
			w,
			"invalid credentials",
			http.StatusUnauthorized,
		)
		return
	}

	if !auth.CheckPassword(
		request.Password,
		admin.PasswordHash,
	) {
		http.Error(
			w,
			"invalid credentials",
			http.StatusUnauthorized,
		)
		return
	}

	token, err := auth.GenerateToken(
		admin.ID,
		admin.Username,
		h.jwtSecret,
	)
	if err != nil {
		http.Error(
			w,
			"failed to generate token",
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(LoginResponse{
		Token: token,
	})
}
