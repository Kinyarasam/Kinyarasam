package pkg

import (
	adminService "github.com/kinyarasam/kinyarasam/internal/core/pkg/admin"
	"github.com/sirupsen/logrus"
)

var Service ApiService

type Config struct {
	AdminConfig *adminService.Config `required:"true" split_words:"true"`
}

type ApiService struct {
	Config   *Config
	AdminDao adminService.DAO
}

func Initialize(c *Config) error {
	logrus.Info("Initialize Service")

	Service = ApiService{
		Config: c,
	}

	Service.AdminDao = adminService.NewService(Service.Config.AdminConfig)

	return nil
}
