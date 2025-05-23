package server

import (
	"net/http"

	"github.com/gorilla/mux"
	authRoutes "github.com/kinyarasam/kinyarasam/internal/auth/routes"
	"github.com/kinyarasam/kinyarasam/internal/core/config"
	"github.com/kinyarasam/kinyarasam/internal/core/handlers"
	educationRoutes "github.com/kinyarasam/kinyarasam/internal/education/routes"
	experienceRoutes "github.com/kinyarasam/kinyarasam/internal/experience/routes"
	profileRoutes "github.com/kinyarasam/kinyarasam/internal/profile"
	storageRoutes "github.com/kinyarasam/kinyarasam/internal/storage"
	userRoutes "github.com/kinyarasam/kinyarasam/internal/user/routes"
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

	authRoutes.InitializeRoute(authRoutes.Payload{Router: apiRoute, Config: cfg})
	userRoutes.InitializeRoute(userRoutes.Payload{Router: apiRoute, Config: cfg})
	profileRoutes.InitializeRoute(profileRoutes.Payload{Router: apiRoute, Config: cfg})
	profileRoutes.InitializeRoute(profileRoutes.Payload{Router: api, Config: cfg})
	storageRoutes.InitializeRoute(storageRoutes.Payload{Router: apiRoute, Config: cfg})
	educationRoutes.InitializeRoute(educationRoutes.Payload{Router: apiRoute, Config: cfg})
	experienceRoutes.InitializeRoute(experienceRoutes.Payload{Router: apiRoute, Config: cfg})
}
