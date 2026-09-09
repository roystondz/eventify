package config

import "os"

type Config struct {
	Port       string
	DBPath     string
	JWTSecret  string
	CORSOrigin string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/eventify.db"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "development-secret"
	}

	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:3000"
	}

	return Config{
		Port:       port,
		DBPath:     dbPath,
		JWTSecret:  jwtSecret,
		CORSOrigin: corsOrigin,
	}
}
