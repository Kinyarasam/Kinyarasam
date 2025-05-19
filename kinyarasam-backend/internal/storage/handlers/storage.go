package handlers

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	"github.com/kinyarasam/kinyarasam/internal/storage/daos"
	"github.com/kinyarasam/kinyarasam/internal/storage/models"
	"github.com/kinyarasam/kinyarasam/internal/storage/serializers"
	"github.com/sirupsen/logrus"
)

func UploadFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	userId, ok := utils.GetRequestUserID(w, r)
	if !ok {
		return
	}

	uploadsDir := "./internal/storage/uploads"
	err := os.MkdirAll(uploadsDir, os.ModePerm)
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
	}
	defer func(file multipart.File) {
		err = file.Close()
		if err != nil {
			logrus.Error("Error closing file: " + err.Error())
		}
	}(file)

	filePath := fmt.Sprintf("%v/%v", uploadsDir, header.Filename)
	f, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE, os.ModePerm)
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}
	defer func(f *os.File) {
		err := f.Close()
		if err != nil {
			logrus.Error("Failed to close file: " + err.Error())
		}
	}(f)

	// Close the file to the destination path
	_, err = io.Copy(f, file)
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	uploadedFile, err := os.Open(filePath)
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}
	defer func(uploadedFile *os.File) {
		err := uploadedFile.Close()
		if err != nil {
			logrus.Error("failed to close uploaded file: " + err.Error())
		}
	}(uploadedFile)

	fi, err := os.Stat(filePath)
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	fileSize := fi.Size()
	fileMimeType := header.Header.Get("Content-Type")

	storageId, err := daos.UploadFile(r.Context(), serializers.UploadRequest{
		File:         uploadedFile,
		FileName:     header.Filename,
		FileMimeType: fileMimeType,
		FileSize:     fileSize,
		UserId:       userId,
	})
	if err != nil {
		logrus.Error(err)
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}

	// Delete local copy of file after uploading
	err = os.Remove(filePath)
	if err != nil {
		logrus.Warn("failed to delete uploaded file: " + header.Filename + "err=[" + err.Error() + "]")
	}

	extension := filepath.Ext(header.Filename)
	fileUrl := fmt.Sprintf("https://%s/api/v1/files/read/%s%v", r.Host, storageId, extension)

	w.Header().Set("file_name", header.Filename)
	w.Header().Set("file_size", fmt.Sprintf("%v", fileSize))
	w.Header().Set("mime_type", fileMimeType)
	w.Header().Set("file_extension", extension)

	response := utils.Response{
		Message: "Successfully Uploaded file",
		Success: true,
		Data:    fileUrl,
	}
	if err = utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		utils.HandleInternalServerError(w, err.Error())
	}
}

func GetFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	objectId := mux.Vars(r)["file_id"]
	if strings.Contains(objectId, ".") {
		objectId = strings.Split(objectId, ".")[0]
	}
	condition := models.Files{
		Model: base.Model{
			Id: objectId,
		},
	}
	object, err := postgres.Service.DAO.Get(r.Context(), condition)
	if err != nil {
		utils.HandleBadRequest(w, err.Error(), nil)
		return
	}
	file := object.(models.Files)

	// Get the file content from Cloudinary
	fileContent, err := http.Get(file.Url)
	if err != nil {
		utils.HandleBadRequest(w, "Failed to fetch file content", nil)
		return
	}
	defer fileContent.Body.Close()

	// Verify successful response
	if fileContent.StatusCode != http.StatusOK {
		utils.HandleBadRequest(w, fmt.Sprintf("Storage returned status %d", fileContent.StatusCode), nil)
		return
	}

	// Get content metadata
	mimeType := fileContent.Header.Get("Content-Type")
	if mimeType == "" {
		ext := filepath.Ext(file.Name)
		mimeType = getMimeTypeFromExtension(ext)
	}

	contentLength := fileContent.Header.Get("Content-Length")
	if contentLength == "" {
		contentLength = "0" // Default if unknown
	}

	// Set response headers
	w.Header().Set("Content-Disposition", fmt.Sprintf("inline; filename=%s", file.Name))
	w.Header().Set("Content-Type", mimeType)
	w.Header().Set("Content-Length", contentLength)
	w.Header().Set("file_name", file.Name)
	w.Header().Set("file_size", contentLength)
	w.Header().Set("mime_type", mimeType)

	// Stream file to client
	_, err = io.Copy(w, fileContent.Body)
	if err != nil {
		logrus.Errorf("Failed to stream file: %v", err)
		return
	}
}

func GetFileInfo(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successful request",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusOK)
}

func DeleteFile(
	w http.ResponseWriter,
	r *http.Request,
) {
	response := utils.Response{
		Message: "Successful request",
		Success: true,
	}
	utils.WriteHTTPResponse(w, response, http.StatusNoContent)
}

// Helper function to determine MIME type from file extension
func getMimeTypeFromExtension(ext string) string {
	ext = strings.ToLower(ext)
	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".gif":
		return "image/gif"
	case ".pdf":
		return "application/pdf"
	case ".txt":
		return "text/plain"
	case ".mp4":
		return "video/mp4"
	case ".mp3":
		return "audio/mpeg"
	default:
		return "application/octet-stream"
	}
}
