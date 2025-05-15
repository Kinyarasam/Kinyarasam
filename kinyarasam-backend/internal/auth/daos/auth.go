package daos

import (
	"time"

	"github.com/jinzhu/copier"
	"github.com/kinyarasam/kinyarasam/internal/auth/serializers"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/user/models"
)

func GenerateAuthToken(
	user models.User,
	expiration time.Duration,
) (string, error) {
	var cfg *config.WebServerConfig
	var userData serializers.UserData

	secretKey := []byte(cfg.JWTSecret)

	subject := user.Id
	copier.Copy(&userData, &user)

	customClaims := map[string]interface{}{
		"user": userData,
	}

	return utils.GenerateToken(subject, customClaims, secretKey, expiration)
}

func GenerateRefreshToken(
	user models.User,
) (string, error) {
	var cfg *config.WebServerConfig
	refreshSecretKey := []byte(cfg.JWTRefreshSecret)

	subject := user.Id
	customClaims := map[string]interface{}{
		"user_id": user.Id,
	}
	expiration := 7 * 24 * time.Hour

	return utils.GenerateToken(subject, customClaims, refreshSecretKey, expiration)
}
