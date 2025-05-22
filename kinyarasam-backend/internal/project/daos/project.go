package daos

import (
	"context"
	"errors"

	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/project/models"
	"gorm.io/gorm"
)

func CreateProject(
	ctx context.Context,
	request *models.Project,
) (*models.Project, error) {
	condition := models.Project{
		Title: request.Title,
	}
	result, err := postgres.Service.DAO.Get(ctx, condition)
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	}
	if result != nil {
		return nil, errors.New("already exists")
	}

	created, pgErr := postgres.Service.DAO.Create(ctx, request, request)
	if pgErr != nil {
		return nil, pgErr.Err
	}

	return created.(*models.Project), nil
}
