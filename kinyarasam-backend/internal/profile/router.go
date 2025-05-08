package profile

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/profile/handlers"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	secureRouter := payload.Router.PathPrefix("/profile").Subrouter()

	secureRouter.HandleFunc("", handlers.GetProfile).Methods(http.MethodGet)
}
