package daos

import (
	"time"

	"github.com/jinzhu/copier"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	baseModels "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/user/models"
)

func GenerateAuthToken(
	user models.User,
	expiration time.Duration,
) (string, error) {
	cfg, err := config.FromEnv()
	if err != nil {
		return "", err
	}
	secretKey := []byte(cfg.JWTSecret)

	userData := baseModels.AuthUserData{}
	copier.Copy(&userData, &user)
	userData.IsAdmin = user.Role == models.Admin

	subject := user.Id

	customClaims := map[string]interface{}{
		"user": userData,
	}

	return utils.GenerateToken(subject, customClaims, secretKey, expiration)
}

func GenerateRefreshToken(
	user models.User,
) (string, error) {
	cfg, err := config.FromEnv()
	if err != nil {
		return "", err
	}
	refreshSecretKey := []byte(cfg.JWTRefreshSecret)

	subject := user.Id
	customClaims := map[string]interface{}{
		"user_id": user.Id,
	}
	expiration := 7 * 24 * time.Hour

	return utils.GenerateToken(subject, customClaims, refreshSecretKey, expiration)
}
