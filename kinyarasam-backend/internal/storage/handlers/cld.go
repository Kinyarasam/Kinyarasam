package handlers

import (
	"net/http"

	"github.com/kinyarasam/kinyarasam/internal/core/utils"
)

func UploadFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successfully Uploaded file",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusOK)
}

func GetFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successful request",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusOK)
}

func GetFileInfo(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successful request",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusOK)
}

func DeleteFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successful request",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusNoContent)
}
