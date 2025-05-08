package server

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/handlers"
	profileRoutes "github.com/kinyarasam/kinyarasam/internal/profile"
)

type Router struct {
	*mux.Router
}

func NewRouter() *Router {
	router := &Router{mux.NewRouter()}

	// Set custom error handlers
	router.NotFoundHandler = http.HandlerFunc(handlers.NotFoundHandler)
	router.MethodNotAllowedHandler = http.HandlerFunc(handlers.MethodNotAllowedHandler)

	return router
}

func (r *Router) InitializeRoutes(cfg *config.WebServerConfig) {

	apiRoute := r.Router.PathPrefix("/api/v1").Subrouter()
	api := r.Router.PathPrefix("/api").Subrouter()

	profileRoutes.InitializeRoute(profileRoutes.Payload{Router: apiRoute, Config: cfg})
	profileRoutes.InitializeRoute(profileRoutes.Payload{Router: api, Config: cfg})
}
