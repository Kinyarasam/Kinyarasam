package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/user/handlers"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	userRoutes := payload.Router.PathPrefix("/users").Subrouter()

	userRoutes.HandleFunc("", handlers.RegisterUser).Methods(http.MethodPost)
}
