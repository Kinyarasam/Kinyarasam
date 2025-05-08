package handlers

import (
	"net/http"

	"github.com/kinyarasam/kinyarasam/internal/core/utils"
)

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTTPResponse(w, utils.Response{
		Success: false,
		Message: "Resource not found",
		Errors:  "The requested resource could not be found",
	}, http.StatusNotFound)
}

func MethodNotAllowedHandler(w http.ResponseWriter, r *http.Request) {
	utils.WriteHTTPResponse(w, utils.Response{
		Success: false,
		Message: "Method not allowed",
		Errors:  "The requested method is not supported for this resource",
	}, http.StatusMethodNotAllowed)
}
