package utils

import (
	"encoding/json"
	"net/http"
	"reflect"

	"github.com/google/uuid"
	"github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/sirupsen/logrus"
)

const (
	secondsInOneYear = "31536000"
	ContentTypeJson  = "application/json"
	UUID4Regex       = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}"
)

type StringContextKey string

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

// setSecurityResponseHeader sets required security headers (i.e. for Checkmarx)
func setSecurityResponseHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Security-Policy", "default-src 'self';")
	w.Header().Set("Strict-Transport-Security", "max-age="+secondsInOneYear)
}

// setResponseHeader sets common header and content type
func setResponseHeader(w http.ResponseWriter) {
	w.Header().Set("Content-Type", ContentTypeJson)
	w.Header().Set("Api-Version", "1.0")
	w.Header().Set("Request-Id", uuid.NewString())
	setSecurityResponseHeader(w)
}

func WriteHTTPResponse(w http.ResponseWriter, response Response, statusCode int) error {
	setResponseHeader(w)
	w.WriteHeader(statusCode)

	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		return err
	}

	return nil
}

func WriteErrorResponse(w http.ResponseWriter, response Response, statusCode int) {
	err := WriteHTTPResponse(w, response, statusCode)
	if err != nil {
		logrus.WithError(err).Logger.Error("error sending http response")
	}
}

func HandleBadRequest(w http.ResponseWriter, message string, serializationError []models.Error) {
	WriteErrorResponse(w, Response{
		Message: message,
		Errors:  serializationError,
	}, http.StatusBadRequest)
}

func HandleForbiddenRequest(w http.ResponseWriter) {
	WriteErrorResponse(
		w, Response{
			Message: "not permitted",
			Errors:  nil,
		}, http.StatusForbidden)
}

func HandleRecordNotFoundError(w http.ResponseWriter, message string) {
	WriteErrorResponse(w, Response{
		Message: message,
	}, http.StatusNotFound)
}

func HandleInternalServerError(w http.ResponseWriter, err string) {
	WriteErrorResponse(w, Response{Message: err}, http.StatusInternalServerError)
}

func HandleUnauthorized(w http.ResponseWriter, message string) {
	WriteErrorResponse(w, Response{Message: message}, http.StatusUnauthorized)
}

func HandleValidationFailure(w http.ResponseWriter, message string) {
	WriteErrorResponse(w, Response{Message: message}, http.StatusBadRequest)
}

func HandleUnprocessableEntityError(w http.ResponseWriter, err string) {
	WriteErrorResponse(w, Response{Message: err}, http.StatusUnprocessableEntity)
}

// Log struct
func LogStruct(st interface{}) {
	stJson, _ := json.Marshal(st)
	logrus.Infof("%s: %s", reflect.TypeOf(st).String(), stJson)
}
