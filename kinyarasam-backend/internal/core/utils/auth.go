package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func ComparePassword(hash []byte, password []byte) error {
	return bcrypt.CompareHashAndPassword(hash, password)
}

func EncryptPassword(password string) ([]byte, error) {
	pwd, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return nil, err
	}
	return pwd, nil
}

func GenerateToken(
	subject string,
	customClaims map[string]interface{},
	secret []byte,
	expiration time.Duration,
) (string, error) {
	now := time.Now()

	claims := jwt.MapClaims{
		"jti": uuid.NewString(),
		"sub": subject,
		"iss": "KINYARASAM_API",
		"exp": now.Add(expiration).Unix(),
		"iat": now.Unix(),
		"nbf": now.Unix(),
	}

	for key, value := range customClaims {
		claims[key] = value
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}
