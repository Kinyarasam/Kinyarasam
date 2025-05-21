package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/middlewares"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/experience/handlers"
)

type Payload struct {
	Config *config.WebServerConfig
	Router *mux.Router
}

func InitializeRoute(payload Payload) {
	apiRouter := payload.Router.PathPrefix("/experience").Subrouter()

	apiRouter.HandleFunc("", handlers.ListExperienceHandler).Methods(http.MethodGet)
	apiRouter.HandleFunc("/{experience_id:"+utils.UUID4Regex+"}", handlers.GetExperienceHandler).Methods(http.MethodGet)

	protectedRouter := apiRouter.NewRoute().Subrouter()
	protectedRouter.Use(middlewares.AuthMiddleware(payload.Config))
	protectedRouter.HandleFunc("", handlers.CreateExperience).Methods(http.MethodPost)
	protectedRouter.HandleFunc("/{experience_id:"+utils.UUID4Regex+"}", handlers.UpdateExperience).Methods(http.MethodPatch)
	// protectedRouter.HandleFunc("/{experience_id:"+utils.UUID4Regex+"}", handlers.DeleteExperience).Methods(http.MethodDelete)
}
