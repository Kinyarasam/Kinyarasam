package daos

import (
	"context"

	"github.com/jinzhu/copier"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/education/models"
	"github.com/kinyarasam/kinyarasam/internal/education/serializers"
	"github.com/sirupsen/logrus"
)

func UpdateEducation(
	ctx context.Context,
	educationId,
	userId string,
	request *serializers.UpdateEducationRequest,
) (*models.Education, error) {
	edu, err := postgres.Service.DAO.Get(ctx, models.Education{
		UserID: userId,
		Model: base.Model{
			Id: educationId,
		},
	})
	if err != nil {
		logrus.Error(err.Error())
		return nil, err
	}

	education := edu.(models.Education)

	var updateData models.Education
	copier.Copy(&updateData, &education)

	if request.Degree != "" {
		updateData.Degree = request.Degree
	}
	if request.Institution != "" {
		updateData.Institution = request.Institution
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
	if request.Grade != "" {
		updateData.Grade = request.Grade
	}
	if request.ImageURL != "" {
		updateData.ImageURL = request.ImageURL
	}

	utils.LogStruct(updateData)

	utils.LogStruct(education)

	err = postgres.Service.DAO.Update(ctx, models.Education{
		Model: base.Model{
			Id: educationId,
		},
		UserID: userId,
	}, updateData)

	if err != nil {
		return nil, err
	}

	return &updateData, nil
}
