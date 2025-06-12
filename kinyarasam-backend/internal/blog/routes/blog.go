package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
)

type Payload struct {
	Router *mux.Router
	Config *config.WebServerConfig
}

func InitializeRoute(payload Payload) {
	apiRouter := payload.Router.PathPrefix("blog").Subrouter()

	apiRouter.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		utils.WriteErrorResponse(w, utils.Response{
			Message: "successful Request",
			Success: true,
			Data:    postgres.PaginatedResponse{},
		}, http.StatusOK)
	}).Methods(http.MethodGet)

	apiRouter.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		utils.WriteErrorResponse(w, utils.Response{
			Message: "successful Request",
			Success: true,
			Data:    "",
		}, http.StatusOK)
	}).Methods(http.MethodPost)
}
