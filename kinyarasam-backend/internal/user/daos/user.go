package daos

import (
	"context"
	"errors"

	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/user/models"
)

func GetUserByPhoneNumber(
	ctx context.Context,
	phoneNumber string,
) (interface{}, error) {
	return postgres.Service.DAO.Get(ctx, models.User{
		PhoneNumber: phoneNumber,
	})
}

func CreateUser(
	ctx context.Context,
	user *models.User,
) (*models.User, error) {
	condition := models.User{
		PhoneNumber: user.PhoneNumber,
	}

	result, pgError := postgres.Service.DAO.Create(ctx, condition, user)
	if pgError != nil {
		return nil, errors.New(pgError.Err.Error())
	}

	newRecord := result.(*models.User)

	return newRecord, nil
}
