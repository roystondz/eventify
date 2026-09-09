package auth

import "golang.org/x/crypto/bcrypt"

// HashPassword converts a plain-text password into a bcrypt hash.
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

// CheckPassword verifies a plain-text password against a bcrypt hash.
func CheckPassword(password, passwordHash string) bool {
	err := bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(password),
	)

	return err == nil
}
