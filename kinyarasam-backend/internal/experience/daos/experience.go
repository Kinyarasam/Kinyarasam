package daos

import (
	"context"

	"github.com/jinzhu/copier"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/experience/models"
	"github.com/kinyarasam/kinyarasam/internal/experience/serializers"
	"github.com/sirupsen/logrus"
)

func UpdateExperience(
	ctx context.Context,
	experienceId,
	userId string,
	request *serializers.UpdateExperienceRequest,
) (*models.Experience, error) {
	edu, err := postgres.Service.DAO.Get(ctx, models.Experience{
		UserID: userId,
		Model: base.Model{
			Id: experienceId,
		},
	})
	if err != nil {
		logrus.Error(err.Error())
		return nil, err
	}

	experience := edu.(models.Experience)

	var updateData models.Experience
	copier.Copy(&updateData, &experience)

	if request.Title != "" {
		updateData.Title = request.Title
	}
	if request.Company != "" {
		updateData.Company = request.Company
	}
	if request.StartDate != nil {
		updateData.StartDate = *request.StartDate
	}
	if request.EndDate != nil {
		updateData.EndDate = request.EndDate
	}
	if request.Description != "" {
		updateData.Description = request.Description
	}
	if request.EmploymentType != "" {
		updateData.EmploymentType = models.EmploymentType(request.EmploymentType)
	}
	if request.ImageURL != "" {
		updateData.ImageURL = request.ImageURL
	}

	err = postgres.Service.DAO.Update(ctx, models.Experience{
		Model: base.Model{
			Id: experienceId,
		},
		UserID: userId,
	}, updateData)

	if err != nil {
		return nil, err
	}

	return &updateData, nil
}
