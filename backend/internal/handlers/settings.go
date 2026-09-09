package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"eventify-backend/internal/store"
)

type SettingsHandler struct {
	store *store.Store
}

func NewSettingsHandler(store *store.Store) *SettingsHandler {
	return &SettingsHandler{
		store: store,
	}
}

type SettingRequest struct {
	Value string `json:"value"`
}

func (h *SettingsHandler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	settings, err := h.store.GetSettings(
		r.Context(),
	)
	if err != nil {
		http.Error(
			w,
			"failed to retrieve settings",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		settings,
	)
}

func (h *SettingsHandler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	key := strings.TrimSpace(
		r.PathValue("key"),
	)

	if key == "" {
		http.Error(
			w,
			"setting key is required",
			http.StatusBadRequest,
		)
		return
	}

	var request SettingRequest

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

	request.Value = strings.TrimSpace(
		request.Value,
	)

	setting, err := h.store.UpsertSetting(
		r.Context(),
		key,
		request.Value,
	)
	if err != nil {
		http.Error(
			w,
			"failed to update setting",
			http.StatusInternalServerError,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		setting,
	)
}
