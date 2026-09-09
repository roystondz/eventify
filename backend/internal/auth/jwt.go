package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	AdminID  int    `json:"admin_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func GenerateToken(
	adminID int,
	username string,
	secret string,
) (string, error) {

	now := time.Now()

	claims := Claims{
		AdminID:  adminID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   fmt.Sprintf("%d", adminID),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	return token.SignedString([]byte(secret))
}

func ValidateToken(
	tokenString string,
	secret string,
) (*Claims, error) {

	token, err := jwt.ParseWithClaims(
		tokenString,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("unexpected signing method")
			}

			return []byte(secret), nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, fmt.Errorf("invalid claims")
	}

	return claims, nil
}
