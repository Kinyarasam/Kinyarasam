package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
)

type Server struct {
	Configuration *config.WebServerConfig
	Router        *Router
}

func NewServer(config *config.WebServerConfig) *Server {
	return &Server{
		Configuration: config,
		Router:        NewRouter(),
	}
}

func RunServer() (err error) {
	webServerConfig, err := config.FromEnv()
	if err != nil {
		return err
	}

	logrus.Infof("Starting HTTPS server on port %s", webServerConfig.Port)

	// Initialize the database
	err = postgres.InitDB(webServerConfig.PostgresDSN)
	if err != nil {
		logrus.WithField("Error", err).Error("Error initializing postgres db")
		return err
	}

	if err := pkg.Initialize(webServerConfig.Service); err != nil {
		logrus.WithError(err).Error("Failed to initialize services")
		return err
	}

	// Initialize and seed admin
	err = pkg.Service.AdminDao.SeedAdmin(context.Background())
	if err != nil {
		logrus.WithError(err).Error("Failed to seed admin user")
		return err
	}

	server := NewServer(webServerConfig)
	server.Router.InitializeRoutes(webServerConfig)

	c := cors.New(cors.Options{
		AllowedHeaders: []string{},
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "UPDATE", "OPTIONS", "DELETE", "PATCH"},
	})

	var handler http.Handler

	if webServerConfig.CorsEnabled {
		handler = c.Handler(*server.Router)
	} else {
		handler = *server.Router
	}

	if err := http.ListenAndServe(
		fmt.Sprintf("%v:%v", "", webServerConfig.Port),
		handler,
	); err != nil {
		panic(err)
	}

	return nil
}
