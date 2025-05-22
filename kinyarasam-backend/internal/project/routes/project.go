package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/project/handlers"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRpute(payload Payload) {
	apiRouter := payload.Router.PathPrefix("/project").Subrouter()

	apiRouter.HandleFunc("", handlers.ListProjectHandler).Methods(http.MethodPost)
	apiRouter.HandleFunc("/{project_id}", handlers.GetProjectHandler).Methods(http.MethodPost)

	apiRouter.HandleFunc("", handlers.CreateProjectHandler).Methods(http.MethodPost)
	apiRouter.HandleFunc("/{project_id}", handlers.GetProjectHandler).Methods(http.MethodPost)
	apiRouter.HandleFunc("/{project_id}", handlers.UpdateProjectHandler).Methods(http.MethodPost)
	apiRouter.HandleFunc("/{project_id}", handlers.DeleteProjectHandler).Methods(http.MethodPost)
}
