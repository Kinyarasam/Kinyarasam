package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/middlewares"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/education/handlers"
)

type Payload struct {
	Config *config.WebServerConfig
	Router *mux.Router
}

func InitializeRoute(payload Payload) {
	apiRouter := payload.Router.PathPrefix("/education").Subrouter()

	apiRouter.HandleFunc("", handlers.ListEducationHandler).Methods(http.MethodGet)
	apiRouter.HandleFunc("/{education_id:"+utils.UUID4Regex+"}", handlers.GetEducationHandler).Methods(http.MethodGet)

	protectedRouter := apiRouter.NewRoute().Subrouter()
	protectedRouter.Use(middlewares.AuthMiddleware(payload.Config))
	protectedRouter.HandleFunc("", handlers.CreateEducation).Methods(http.MethodPost)
	protectedRouter.HandleFunc("/{education_id:"+utils.UUID4Regex+"}", handlers.UpdateEducation).Methods(http.MethodPatch)
	// protectedRouter.HandleFunc("/{education_id:"+utils.UUID4Regex+"}", handlers.DeleteEducation).Methods(http.MethodDelete)
}
