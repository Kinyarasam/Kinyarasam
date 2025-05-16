package storage

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/middlewares"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/storage/handlers"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	apiRouter := payload.Router.PathPrefix("/files").Subrouter()

	protectedRouter := apiRouter.PathPrefix("/upload").Subrouter()
	openRouter := apiRouter.PathPrefix("/read").Subrouter()
	infoRouter := apiRouter.PathPrefix("/info").Subrouter()

	// protect file uploads.
	protectedRouter.Use(middlewares.AuthMiddleware(payload.Config))
	protectedRouter.HandleFunc("", handlers.UploadFile).Methods(http.MethodPost)
	protectedRouter.HandleFunc("/{file_id:"+utils.UUID4Regex+"}", handlers.DeleteFile).Methods(http.MethodDelete)

	openRouter.HandleFunc("/{file_id:"+utils.UUID4Regex+"}", handlers.GetFile).Methods(http.MethodGet)

	infoRouter.HandleFunc("/{file_id:"+utils.UUID4Regex+"}", handlers.GetFileInfo).Methods(http.MethodGet)
}
