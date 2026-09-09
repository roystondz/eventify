package handlers

import (
	"encoding/json"
	"net/http"
)

type healthResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func CheckHealth(w http.ResponseWriter, r *http.Request) {
	response := healthResponse{
		Status:  "ok",
		Message: "Eventify API is up and running",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
