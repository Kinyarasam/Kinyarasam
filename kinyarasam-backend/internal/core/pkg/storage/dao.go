package storage

import (
	"context"

	"github.com/kinyarasam/kinyarasam/internal/core/pkg/storage/serializers"
)

type DAO interface {
	Upload(
		ctx context.Context,
		request serializers.CloudinaryUploadRequest,
	) (*serializers.CloudinaryUploadResponse, error)
	Get(
		ctx context.Context,
		request *serializers.CloudinaryGetRequest,
	) (interface{}, *int64, error)
}
