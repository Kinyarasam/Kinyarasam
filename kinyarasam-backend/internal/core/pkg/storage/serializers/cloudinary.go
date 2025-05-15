package serializers

import "io"

type CloudinaryUploadRequest struct {
	FileName string        `json:"fileName"`
	MimeType string        `json:"mimeType"`
	File     io.ReadSeeker `json:"file"`
}
