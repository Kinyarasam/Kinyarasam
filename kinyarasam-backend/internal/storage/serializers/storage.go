package serializers

import "mime/multipart"

type UploadRequest struct {
	File         multipart.File `json:"file"`
	FileName     string         `json:"file_name"`
	FileMimeType string         `json:"file_mime_type"`
	FileSize     int64          `json:"file_size"`
	UserId       string         `json:"user_id"`
}
