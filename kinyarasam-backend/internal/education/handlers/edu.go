package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/copier"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/education/daos"
	"github.com/kinyarasam/kinyarasam/internal/education/models"
	"github.com/kinyarasam/kinyarasam/internal/education/serializers"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func ListEducationHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	var params postgres.PaginationParams
	if err := utils.ExtractPaginationParams(r, &params); err != nil {
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	education, err := postgres.Service.DAO.GetPaginated(r.Context(), models.Education{}, &params)
	if err != nil {
		logrus.Error()
	}

	logrus.Info(education)
	response := utils.Response{
		Message: "Successful request",
		Success: true,
		Data:    education,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "Error writing http response")
		return
	}
}

func CreateEducation(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	var request serializers.CreateEducationRequest
	if err := utils.ValidateHTTPRequestPayload(w, r, &request); err != nil {
		return
	}

	var eduModel models.Education
	if err := copier.Copy(&eduModel, &request); err != nil {
		logrus.WithError(err).Error("failed to copy request to model")
		utils.HandleInternalServerError(w, "Internal server error")
		return
	}

	eduModel.UserID = userId
	createdEducation, pgError := postgres.Service.DAO.Create(
		r.Context(),
		models.Education{
			Degree: eduModel.Degree,
		},
		eduModel,
	)
	if pgError != nil {
		errMsg := "error creating education"
		if pgError.Err.Error() == gorm.ErrDuplicatedKey.Error() {
			errMsg = "education record exists, try updating it."
			utils.HandleBadRequest(w, errMsg, nil)
			return
		}
		logrus.WithError(pgError.Err).Error(errMsg)
		utils.HandleInternalServerError(w, "error creating education")
		return
	}
	education := createdEducation.(*models.Education)

	response := utils.Response{
		Message: "Education added successfully",
		Success: true,
		Data:    &education,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.Error(err)
		utils.HandleInternalServerError(w, "error writing http response")
	}

}

func UpdateEducation(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	educationId := mux.Vars(r)["education_id"]
	if educationId == "" {
		utils.HandleBadRequest(w, "empty education id", nil)
		return
	}

	var request serializers.UpdateEducationRequest
	if err := utils.ValidateHTTPRequestPayload(
		w, r, &request,
		utils.CustomValidationParams{ErrorMessage: "Please fill in all required fields"},
	); err != nil {
		logrus.WithError(err).Error("update education validation error")
		return
	}

	education, err := daos.UpdateEducation(r.Context(), educationId, userId, &request)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleRecordNotFoundError(w, err.Error())
			return
		}
		utils.HandleBadRequest(w, "error updating education: "+err.Error(), nil)
		return
	}

	response := utils.Response{
		Message: "education updated",
		Success: true,
		Data:    education,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.WithError(err).Logger.Error("error writing http response")
		utils.HandleInternalServerError(w, "error writing http response: "+err.Error())
		return
	}
}

func GetEducationHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	educationId := mux.Vars(r)["education_id"]
	if educationId == "" {
		utils.HandleBadRequest(w, "empty education id", nil)
		return
	}

	result, err := postgres.Service.DAO.Get(r.Context(), models.Education{Model: base.Model{Id: educationId}})
	if err != nil {
		logrus.WithError(err).Logger.Error("error getting education")
		if err == gorm.ErrRecordNotFound {
			utils.HandleRecordNotFoundError(w, err.Error())
			return
		}

		utils.HandleInternalServerError(w, "error getting education: "+err.Error())
		return
	}

	education := result.(models.Education)

	response := utils.Response{
		Message: "successful request",
		Success: true,
		Data:    &education,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "error writing http response")
	}
}
