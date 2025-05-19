package storage

import (
	"context"
	"errors"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/jinzhu/copier"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/storage/serializers"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/sirupsen/logrus"
)

type Config struct {
	CloudinaryApiKey    string `envconfig:"CLOUDINARY_API_KEY" required:"true" split_words:"true"`
	CloudinaryApiSecret string `envconfig:"CLOUDINARY_API_SECRET" required:"true" split_words:"true"`
	CloudName           string `envconfig:"CLOUD_NAME" required:"true" split_words:"true"`
}

type Service struct {
	Cloudinary *cloudinary.Cloudinary
	Config     *Config
}

func NewServer(config *Config) *Service {
	cld, err := cloudinary.NewFromParams(
		config.CloudName,
		config.CloudinaryApiKey,
		config.CloudinaryApiSecret,
	)
	if err != nil {
		logrus.WithError(err).Logger.Error("Error creating cloudinary session")
	}
	cld.Config.URL.Secure = true

	return &Service{
		Cloudinary: cld,
		Config:     config,
	}
}

func (s *Service) Upload(
	ctx context.Context,
	request serializers.CloudinaryUploadRequest,
) (*serializers.CloudinaryUploadResponse, error) {
	key := request.UserId + "/" + request.FileName
	resp, err := s.Cloudinary.Upload.Upload(
		ctx,
		request.File,
		uploader.UploadParams{
			PublicID:     key,
			ResourceType: request.MimeType,
			DisplayName:  request.FileName,
		},
	)
	if err != nil {
		return nil, err
	}
	var response serializers.CloudinaryUploadResponse

	copier.Copy(&response, &resp)
	if response.Error.Message != "" {
		return nil, errors.New(response.Error.Message)
	}
	return &response, err
}

func (s *Service) Get(
	ctx context.Context,
	request *serializers.CloudinaryGetRequest,
) (interface{}, *int64, error) {
	objectOutput, err := s.Cloudinary.Image(request.FileKey)
	// 	admin.AssetParams{
	// 	PublicID: request.FileKey,
	// })
	if err != nil {
		return nil, nil, err
	}
	var size int64 = 0

	utils.LogStruct(objectOutput)
	return objectOutput, &size, nil
}
