package routes

import (
	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	payload.Router.PathPrefix("/users").Subrouter()
}
