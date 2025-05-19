package pkg

import (
	adminService "github.com/kinyarasam/kinyarasam/internal/core/pkg/admin"
	cloudinaryService "github.com/kinyarasam/kinyarasam/internal/core/pkg/storage"
	"github.com/sirupsen/logrus"
)

var Service ApiService

type Config struct {
	AdminConfig      *adminService.Config      `required:"true" split_words:"true"`
	CloudinaryConfig *cloudinaryService.Config `required:"true" split_words:"true"`
}

type ApiService struct {
	Config   *Config
	AdminDao adminService.DAO
	CldDao   cloudinaryService.DAO
}

func Initialize(c *Config) error {
	logrus.Info("Initialize Service")

	Service = ApiService{
		Config: c,
	}

	Service.AdminDao = adminService.NewService(Service.Config.AdminConfig)
	Service.CldDao = cloudinaryService.NewServer(Service.Config.CloudinaryConfig)

	return nil
}
