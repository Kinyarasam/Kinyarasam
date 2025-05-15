package storage

import (
	"context"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/storage/serializers"
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
) error {
	_, err := s.Cloudinary.Upload.Upload(
		ctx,
		request.File,
		uploader.UploadParams{
			PublicID:     request.FileName,
			ResourceType: request.MimeType,
		},
	)
	return err
}

func (s *Service) Get(
	ctx context.Context,
	fileKey string,
) (interface{}, error) {
	objectOutput, err := s.Cloudinary.Image(fileKey)
	if err != nil {
		return nil, err
	}
	return objectOutput, err
}
