package admin

import (
	"context"

	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/user/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type Config struct {
	PhoneNumber    string `envconfig:"ADMIN_PHONE_NUMBER" required:"true" split_words:"true"`
	FirstName      string `envconfig:"ADMIN_FIRST_NAME" required:"true" split_words:"true"`
	LastName       string `envconfig:"ADMIN_LAST_NAME" required:"true" split_words:"true"`
	Surname        string `envconfig:"ADMIN_SURNAME" required:"true" split_words:"true"`
	Email          string `envconfig:"ADMIN_EMAIL" required:"true" split_words:"true"`
	Password       string `envconfig:"ADMIN_PASSWORD" required:"true" split_words:"true"`
	SeedingEnabled bool   `envconfig:"ADMIN_SEEDING_ENABLED" required:"true" split_words:"true"`
}

type Service struct {
	DAO    DAO
	Config *Config
}

func NewService(config *Config) *Service {
	return &Service{Config: config}
}

func (s *Service) SeedAdmin(
	ctx context.Context,
) error {
	if !s.Config.SeedingEnabled {
		logrus.Info("Admin seeding is disabled")
		return nil
	}

	if s.Config.Email == "" || s.Config.PhoneNumber == "" || s.Config.Password == "" {
		logrus.Warn("Skipping admin seed: missing required credentials in environment")
		return nil
	}

	condition := models.User{
		Role: models.Admin,
	}
	_, err := postgres.Service.DAO.Get(ctx, condition)
	if err == nil {
		logrus.Info("Admin user already exists, skipping seed")
		return nil
	} else if err != gorm.ErrRecordNotFound {
		logrus.WithError(err).Error("Error checking for existing admin user")
		return err
	}

	encryptedPassword, _ := utils.EncryptPassword(s.Config.Password)
	_, pgErr := postgres.Service.DAO.Create(ctx, models.User{
		PhoneNumber: s.Config.PhoneNumber,
		Password:    encryptedPassword,
		Role:        models.Admin,
		Email:       s.Config.Email,
		FirstName:   s.Config.FirstName,
		LastName:    s.Config.LastName,
		Surname:     s.Config.Surname,
	}, models.User{})
	if pgErr != nil {
		logrus.WithError(pgErr.Err).Error("Failed to create admin user")
		return pgErr.Err
	}

	logrus.Info("Admin user seeded successfully")
	return nil
}
