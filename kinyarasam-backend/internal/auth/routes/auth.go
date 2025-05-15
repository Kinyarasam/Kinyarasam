package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/auth/handlers"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	payload.Router.HandleFunc("/auth/login", handlers.LoginHandler).Methods(http.MethodPost)
	payload.Router.HandleFunc("/auth/register", handlers.RegisterHandler).Methods(http.MethodPost)
}
