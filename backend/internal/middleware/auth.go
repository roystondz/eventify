package middleware

import (
	"context"
	"net/http"
	"strings"

	"eventify-backend/internal/auth"
)

type contextKey string

const adminClaimsKey contextKey = "adminClaims"

func RequireAuth(
	jwtSecret string,
	next http.Handler,
) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		if authHeader == "" {
			http.Error(
				w,
				"authorization required",
				http.StatusUnauthorized,
			)
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)

		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(
				w,
				"invalid authorization header",
				http.StatusUnauthorized,
			)
			return
		}

		tokenString := parts[1]

		claims, err := auth.ValidateToken(
			tokenString,
			jwtSecret,
		)

		if err != nil {
			http.Error(
				w,
				"invalid or expired token",
				http.StatusUnauthorized,
			)
			return
		}

		ctx := context.WithValue(
			r.Context(),
			adminClaimsKey,
			claims,
		)

		next.ServeHTTP(
			w,
			r.WithContext(ctx),
		)
	})
}
