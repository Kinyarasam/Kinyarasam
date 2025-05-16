package middlewares

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/sirupsen/logrus"
)

var (
	errAuthEmpty        = errors.New("authorization header is empty")
	errInvalidAuthToken = errors.New("invalid auth token")
)

func AuthMiddleware(cfg *config.WebServerConfig) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logrus.Debug("Auth middleware triggered")

			authHeader := r.Header.Get("Authorization")
			logrus.WithField("auth_header", authHeader).Debug("Received auth header")

			user, err := validateAuthToken(cfg, r)

			if err != nil {
				utils.HandleUnauthorized(w, err.Error())
				return
			}

			// Add user to context
			userKey := utils.StringContextKey("user")
			ctx := context.WithValue(r.Context(), userKey, user)
			r = r.WithContext(ctx)

			h.ServeHTTP(w, r)
		})
	}
}

func ValidateToken(tokenStr string, secretKey []byte) (*jwt.Token, error) {
	token, err := jwt.ParseWithClaims(
		tokenStr, &models.AuthClaimsData{}, func(token *jwt.Token) (interface{}, error) {
			// validate the alg
			// Make sure that the token method conform to "SigningMethodHMAC"
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("Unexpected signing method", jwt.ValidationErrorSignatureInvalid)
			}

			return secretKey, nil
		})
	if err != nil {
		return nil, err
	}
	return token, nil
}

func GetUserFromAuthToken(token *jwt.Token) (*models.AuthUserData, error) {
	claims, ok := token.Claims.(*models.AuthClaimsData)
	logrus.Info(claims, ok)
	if !ok || !token.Valid {
		return nil, errors.New("invalid claims format")
	}

	return &claims.User, nil
}

func extractBearerToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", errAuthEmpty
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", errInvalidAuthToken
	}

	return authHeader[7:], nil
}

func validateAuthToken(
	cfg *config.WebServerConfig,
	r *http.Request,
) (*models.AuthUserData, error) {
	secretKey := []byte(cfg.JWTSecret)
	authToken, err := extractBearerToken(r)
	if err != nil {
		return nil, err
	}

	if authToken == "" {
		logrus.WithError(errAuthEmpty)
		return nil, errors.New(errAuthEmpty.Error())
	}

	token, err := ValidateToken(authToken, secretKey)
	if err != nil {
		logrus.WithError(err).Error(err.Error())
	}

	return GetUserFromAuthToken(token)
}
