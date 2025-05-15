package handlers

import (
	"net/http"

	"github.com/kinyarasam/kinyarasam/internal/core/utils"
)

func RegisterUser(
	w http.ResponseWriter,
	r *http.Request,
) {
	if err := utils.WriteHTTPResponse(w, utils.Response{
		Message: "Successful Request",
		Success: true,
	}, http.StatusAccepted); err != nil {
		utils.HandleInternalServerError(w, "Error writing http response.")
	}
}
