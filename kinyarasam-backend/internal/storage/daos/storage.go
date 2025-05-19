package daos

import (
	"context"

	"github.com/kinyarasam/kinyarasam/internal/core/pkg"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	cldSerializers "github.com/kinyarasam/kinyarasam/internal/core/pkg/storage/serializers"
	"github.com/kinyarasam/kinyarasam/internal/storage/models"
	"github.com/kinyarasam/kinyarasam/internal/storage/serializers"
	"github.com/sirupsen/logrus"
)

func UploadFile(
	ctx context.Context,
	request serializers.UploadRequest,
) (string, error) {
	uploadResponse, err := pkg.Service.CldDao.Upload(ctx, cldSerializers.CloudinaryUploadRequest{
		FileName: request.FileName,
		MimeType: request.FileMimeType,
		File:     request.File,
		UserId:   request.UserId,
	})
	if err != nil {
		return "", err
	}

	condition := models.Files{
		Name:     request.FileName,
		MimeType: request.FileMimeType,
		FileSize: request.FileSize,
		UserId:   request.UserId,
		Url:      uploadResponse.SecureURL,
	}

	object, created, pgError := postgres.Service.DAO.GetOrCreate(ctx, condition, condition)
	if created {
		logrus.Info("A new file object " + condition.Name + " was created")
	}

	if pgError != nil {
		return "", pgError.Err
	}

	cldObject := object.(*models.Files)
	return cldObject.Id, nil
}
