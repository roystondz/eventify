package router

import (
	"net/http"

	"eventify-backend/internal/handlers"
	"eventify-backend/internal/middleware"
)

func New(
	serviceHandler *handlers.ServiceHandler,
	packageHandler *handlers.PackageHandler,
	addonHandler *handlers.AddonHandler,
	settingsHandler *handlers.SettingsHandler,
	adminHandler *handlers.AdminHandler,
	authHandler *handlers.AuthHandler,
	
	jwtSecret string,
) *http.ServeMux {

	mux := http.NewServeMux()

	// Public routes.

	mux.HandleFunc(
		"GET /api/health",
		handlers.CheckHealth,
	)

	mux.HandleFunc(
		"GET /api/services",
		serviceHandler.List,
	)

	mux.HandleFunc(
		"GET /api/packages",
		packageHandler.List,
	)

	mux.HandleFunc(
		"GET /api/addons",
		addonHandler.List,
	)

	mux.HandleFunc(
		"GET /api/settings",
		settingsHandler.List,
	)

	mux.HandleFunc(
		"POST /admin/login",
		authHandler.Login,
	)

	// Protected service routes.

	mux.Handle(
		"POST /admin/services",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(serviceHandler.Create),
		),
	)

	mux.Handle(
		"PUT /admin/services/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(serviceHandler.Update),
		),
	)

	mux.Handle(
		"DELETE /admin/services/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(serviceHandler.Delete),
		),
	)

	// Protected package routes.

	mux.Handle(
		"POST /admin/packages",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(packageHandler.Create),
		),
	)

	mux.Handle(
		"PUT /admin/packages/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(packageHandler.Update),
		),
	)

	mux.Handle(
		"DELETE /admin/packages/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(packageHandler.Delete),
		),
	)

	// Protected addon routes.

	mux.Handle(
		"POST /admin/addons",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(addonHandler.Create),
		),
	)

	mux.Handle(
		"PUT /admin/addons/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(addonHandler.Update),
		),
	)

	mux.Handle(
		"DELETE /admin/addons/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(addonHandler.Delete),
		),
	)

	// Protected settings route.

	mux.Handle(
		"PUT /admin/settings/{key}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(settingsHandler.Update),
		),
	)
	mux.Handle(
		"GET /admin/admins",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(adminHandler.List),
		),
	)

	mux.Handle(
		"POST /admin/admins",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(adminHandler.Create),
		),
	)

	mux.Handle(
		"PUT /admin/admins/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(adminHandler.Update),
		),
	)

	mux.Handle(
		"PUT /admin/admins/{id}/password",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(adminHandler.ChangePassword),
		),
	)

	mux.Handle(
		"DELETE /admin/admins/{id}",
		middleware.RequireAuth(
			jwtSecret,
			http.HandlerFunc(adminHandler.Disable),
		),
	)

	return mux
}
