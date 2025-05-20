package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"reflect"
	"regexp"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
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

type CustomValidationParams struct {
	ErrorMessage string
}

func ValidateHTTPRequestPayload(
	w http.ResponseWriter,
	r *http.Request,
	serializer interface{},
	params ...CustomValidationParams,
) error {
	serializationErrors, err := UnmarshallJSONFromRequest(r, serializer)
	if err != nil {
		var message string

		if len(params) > 0 {
			message = params[0].ErrorMessage
		} else {
			message = "Invalid request"
		}
		HandleBadRequest(w, message, serializationErrors)
		return err
	}

	return nil
}

func UnmarshallJSONFromRequest(
	r *http.Request,
	data interface{},
) ([]models.Error, error) {
	var serializerErrors []models.Error

	// Read and re-set the body so it can be read again
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		logrus.WithError(err).Error("Failed to read request body")
		return nil, err
	}
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	// Decode JSON
	if err := json.Unmarshal(bodyBytes, data); err != nil {
		logrus.WithError(err).Error("Failed to decode JSON")
		decodeErr := models.Error{
			Key:   "InvalidJsonPayload",
			Error: "Invalid JSON format",
		}
		serializerErrors = append(serializerErrors, decodeErr)
		return serializerErrors, err
	}

	// Validate struct fields
	validate := validator.New(validator.WithRequiredStructEnabled())
	errs := validate.Struct(data)

	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			re := regexp.MustCompile(`'([^']*)'`)
			matches := re.FindAllStringSubmatch(
				strings.Split(fmt.Sprintf("%s", err), "Error:")[1],
				-1,
			)

			validationField := matches[0][1]
			validationTag := matches[1][1]

			errorMessage := strings.Split(fmt.Sprintf("%s", err), "Error:")[1]
			switch validationTag {

			case "required":
				errorMessage = fmt.Sprintf("%s is a required field", validationField)

			case "oneof":
				errorMessage = fmt.Sprintf(
					"%s is required to be one of these options: [%s]",
					validationField,
					err.Param(),
				)

			case "url":
				errorMessage = fmt.Sprintf("%s is required to be a valid URL", validationField)

			case "strong_password":
				errorMessage = fmt.Sprintf(
					"%s is required to contain atleast 8 characters, an uppercase character and a special character",
					validationField,
				)
			}

			serializationError := models.Error{
				Key:   err.Field(),
				Error: errorMessage,
			}
			serializerErrors = append(serializerErrors, serializationError)
		}
		return serializerErrors, errs
	}

	return nil, nil
}

func GetRequestUserID(w http.ResponseWriter, r *http.Request) (string, bool) {
	user, ok := GetRequestUser(w, r)
	if !ok {
		HandleUnauthorized(w, errors.New("unauthorized request").Error())
		return "", false
	}
	return user.Id, true
}

func GetRequestUser(
	w http.ResponseWriter,
	r *http.Request,
) (*models.AuthUserData, bool) {
	userKey := StringContextKey("user")
	user, ok := r.Context().Value(userKey).(*models.AuthUserData)
	if !ok {
		HandleUnauthorized(w, errors.New("unauthorized request").Error())
		return nil, false
	}
	return user, true
}

func ExtractPaginationParams(
	r *http.Request,
	params *postgres.PaginationParams,
) error {
	queryParams := r.URL.Query()
	pageParam := queryParams.Get("page")
	pageSizeParam := queryParams.Get("page_size")

	if pageParam == "" {
		pageParam = "1"
	}
	if pageSizeParam == "" {
		pageSizeParam = "25"
	}

	page, err := strconv.Atoi(pageParam)
	if err != nil {
		return err
	}
	pageSize, err := strconv.Atoi(pageSizeParam)
	if err != nil {
		return err
	}

	params.Page = page
	params.PageSize = pageSize
	params.RouteUrl = r.URL.Path

	if r.TLS != nil {
		params.RouteUrl = fmt.Sprintf("https://%s%s", r.Host, r.URL.Path)
	} else {
		params.RouteUrl = fmt.Sprintf("http://%s%s", r.Host, r.URL.Path)
	}

	return nil
}

func ExtractSearchParams(r *http.Request) *string {
	queryParams := r.URL.Query()
	searchParam := queryParams.Get("search")

	if searchParam == "" {
		return nil
	}
	searchFields := strings.Split(searchParam, ",")
	searchString := strings.Join(searchFields, "|")
	return &searchString
}
