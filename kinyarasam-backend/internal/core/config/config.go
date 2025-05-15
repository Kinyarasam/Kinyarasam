package config

import (
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg"
)

type WebServerConfig struct {
	Port             string `required:"true" split_words:"true" default:"8080"`
	Enviroment       string `required:"true" split_words:"true" default:"DEV"`
	LogLevel         string `required:"true" split_words:"true" `
	CorsEnabled      bool   `default:"true" split_words:"true"`
	JWTSecret        string `required:"true" split_words:"true"`
	JWTRefreshSecret string `required:"true" split_words:"true"`
	PostgresDSN      string `required:"true" split_words:"true"`
	Service          *pkg.Config
}

func FromEnv() (cfg *WebServerConfig, err error) {
	fromFileToEnv()

	cfg = &WebServerConfig{}

	err = envconfig.Process("", cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}

func fromFileToEnv() {
	godotenv.Load(".env")
}
