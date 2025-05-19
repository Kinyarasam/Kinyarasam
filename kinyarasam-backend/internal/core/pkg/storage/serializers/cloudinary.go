package serializers

import (
	"io"

	"github.com/cloudinary/cloudinary-go/api/uploader"
)

type CloudinaryUploadRequest struct {
	FileName string        `json:"fileName"`
	MimeType string        `json:"mimeType"`
	File     io.ReadSeeker `json:"-"`
	UserId   string        `json:"user_id"`
}

type CloudinaryGetRequest struct {
	FileKey string `json:"fileKey"`
	UserId  string `json:"user_id"`
}

type CloudinaryUploadResponse struct {
	uploader.UploadResult
}
