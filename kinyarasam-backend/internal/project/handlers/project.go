package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jinzhu/copier"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/project/daos"
	"github.com/kinyarasam/kinyarasam/internal/project/models"
	"github.com/kinyarasam/kinyarasam/internal/project/serializers"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func CreateProjectHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	var request serializers.CreateProjectRequest
	if err := utils.ValidateHTTPRequestPayload(w, r, &request); err != nil {
		return
	}

	var projectData models.Project
	if err := copier.Copy(&projectData, &request); err != nil {
		utils.HandleInternalServerError(w, "Internal server error")
		return
	}

	projectData.UserID = userId
	project, err := daos.CreateProject(r.Context(), &projectData)
	if err != nil {
		logrus.WithError(err).Logger.Error("error creating new project")
		if err.Error() == "already exists" {
			utils.HandleBadRequest(w, err.Error(), nil)
			return
		}
		utils.HandleInternalServerError(w, "error creating new project: "+err.Error())
	}

	response := utils.Response{
		Message: "New project created",
		Success: true,
		Data:    project,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "error writing http response")
	}
}

func ListProjectHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	var params postgres.PaginationParams
	if err := utils.ExtractPaginationParams(r, &params); err != nil {
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	projects, err := postgres.Service.DAO.GetPaginated(r.Context(), models.Project{}, &params)
	if err != nil {
		logrus.Error()
	}

	response := utils.Response{
		Message: "Successful request",
		Success: true,
		Data:    projects,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "Error writing http response")
		return
	}
}

func GetProjectHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		utils.HandleBadRequest(w, "empty project id", nil)
		return
	}

	result, err := postgres.Service.DAO.Get(r.Context(), models.Project{Model: base.Model{Id: projectId}})
	if err != nil {
		logrus.WithError(err).Logger.Error("error getting project")
		if err == gorm.ErrRecordNotFound {
			utils.HandleRecordNotFoundError(w, err.Error())
			return
		}

		utils.HandleInternalServerError(w, "error getting project: "+err.Error())
		return
	}

	project := result.(models.Project)

	response := utils.Response{
		Message: "successful request",
		Success: true,
		Data:    &project,
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, "error writing http response")
	}
}

func UpdateProjectHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
}

func DeleteProjectHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
}
