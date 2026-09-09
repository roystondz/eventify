package main

import (
	"log"
	"net/http"

	"eventify-backend/internal/config"
	"eventify-backend/internal/db"
	"eventify-backend/internal/handlers"
	"eventify-backend/internal/router"
	"eventify-backend/internal/store"
)

func main() {
	cfg := config.Load()

	database, err := db.Open(cfg.DBPath)
	if err != nil {
		log.Fatal(err)
	}
	defer database.Close()

	log.Printf("Database connected: %s", cfg.DBPath)

	if err := db.Migrate(database); err != nil {
		log.Fatal(err)
	}

	log.Println("Database migrations completed")

	appStore := store.New(database)

	serviceHandler := handlers.NewServiceHandler(appStore)
	packageHandler := handlers.NewPackageHandler(appStore)
	addonHandler := handlers.NewAddonHandler(appStore)
	settingsHandler := handlers.NewSettingsHandler(appStore)
	adminHandler := handlers.NewAdminHandler(appStore)

	authHandler := handlers.NewAuthHandler(
		appStore,
		cfg.JWTSecret,
	)

	mux := router.New(
		serviceHandler,
		packageHandler,
		addonHandler,
		settingsHandler,
		adminHandler,
		authHandler,
		cfg.JWTSecret,
	)

	address := ":" + cfg.Port

	log.Printf(
		"Server starting on http://localhost%s",
		address,
	)

	if err := http.ListenAndServe(address, mux); err != nil {
		log.Fatal(err)
	}
}
