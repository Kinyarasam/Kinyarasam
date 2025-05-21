package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/copier"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/experience/daos"
	"github.com/kinyarasam/kinyarasam/internal/experience/models"
	"github.com/kinyarasam/kinyarasam/internal/experience/serializers"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func ListExperienceHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	var params postgres.PaginationParams
	if err := utils.ExtractPaginationParams(r, &params); err != nil {
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	experience, err := postgres.Service.DAO.GetPaginated(r.Context(), models.Experience{}, &params)
	if err != nil {
		logrus.Error()
	}

	logrus.Info(experience)
	response := utils.Response{
		Message: "Successful request",
		Success: true,
		Data:    experience,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "Error writing http response")
		return
	}
}

func CreateExperience(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	var request serializers.CreateExperienceRequest
	if err := utils.ValidateHTTPRequestPayload(w, r, &request); err != nil {
		return
	}

	var eduModel models.Experience
	if err := copier.Copy(&eduModel, &request); err != nil {
		logrus.WithError(err).Error("failed to copy request to model")
		utils.HandleInternalServerError(w, "Internal server error")
		return
	}

	eduModel.UserID = userId
	createdExperience, pgError := postgres.Service.DAO.Create(
		r.Context(),
		models.Experience{
			Title: eduModel.Title,
		},
		eduModel,
	)
	if pgError != nil {
		errMsg := "error creating experience"
		if pgError.Err.Error() == gorm.ErrDuplicatedKey.Error() {
			errMsg = "experience record exists, try updating it."
			utils.HandleBadRequest(w, errMsg, nil)
			return
		}
		logrus.WithError(pgError.Err).Error(errMsg)
		utils.HandleInternalServerError(w, "error creating experience")
		return
	}
	experience := createdExperience.(*models.Experience)

	response := utils.Response{
		Message: "Experience added successfully",
		Success: true,
		Data:    &experience,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.Error(err)
		utils.HandleInternalServerError(w, "error writing http response")
	}

}

func UpdateExperience(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	experienceId := mux.Vars(r)["experience_id"]
	if experienceId == "" {
		utils.HandleBadRequest(w, "empty experience id", nil)
		return
	}

	var request serializers.UpdateExperienceRequest
	if err := utils.ValidateHTTPRequestPayload(
		w, r, &request,
		utils.CustomValidationParams{ErrorMessage: "Please fill in all required fields"},
	); err != nil {
		logrus.WithError(err).Error("update experience validation error")
		return
	}

	experience, err := daos.UpdateExperience(r.Context(), experienceId, userId, &request)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			utils.HandleRecordNotFoundError(w, err.Error())
			return
		}
		utils.HandleBadRequest(w, "error updating experience: "+err.Error(), nil)
		return
	}

	response := utils.Response{
		Message: "experience updated",
		Success: true,
		Data:    experience,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.WithError(err).Logger.Error("error writing http response")
		utils.HandleInternalServerError(w, "error writing http response: "+err.Error())
		return
	}
}

func GetExperienceHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	experienceId := mux.Vars(r)["experience_id"]
	if experienceId == "" {
		utils.HandleBadRequest(w, "empty experience id", nil)
		return
	}

	result, err := postgres.Service.DAO.Get(r.Context(), models.Experience{Model: base.Model{Id: experienceId}})
	if err != nil {
		logrus.WithError(err).Logger.Error("error getting experience")
		if err == gorm.ErrRecordNotFound {
			utils.HandleRecordNotFoundError(w, err.Error())
			return
		}

		utils.HandleInternalServerError(w, "error getting experience: "+err.Error())
		return
	}

	experience := result.(models.Experience)

	response := utils.Response{
		Message: "successful request",
		Success: true,
		Data:    &experience,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "error writing http response")
	}
}
