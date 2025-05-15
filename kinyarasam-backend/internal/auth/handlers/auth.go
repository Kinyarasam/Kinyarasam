package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/jinzhu/copier"
	"github.com/kinyarasam/kinyarasam/internal/auth/daos"
	"github.com/kinyarasam/kinyarasam/internal/auth/serializers"
	"github.com/kinyarasam/kinyarasam/internal/core/pkg/postgres"
	"github.com/kinyarasam/kinyarasam/internal/core/utils"
	userDaos "github.com/kinyarasam/kinyarasam/internal/user/daos"
	"github.com/kinyarasam/kinyarasam/internal/user/models"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func LoginHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	var loginRequest serializers.LoginRequest

	err := utils.ValidateHTTPRequestPayload(w, r, &loginRequest)
	if err != nil {
		return
	}

	result, err := userDaos.GetUserByPhoneNumber(r.Context(), loginRequest.PhoneNumber)
	if err != nil {
		utils.HandleUnauthorized(w, "Invalid credentials")
		return
	}

	tokenExpiration := 24 * time.Hour
	user := result.(models.User)
	authToken, _ := daos.GenerateAuthToken(user, tokenExpiration)
	refreshToken, _ := daos.GenerateRefreshToken(user)

	response := utils.Response{
		Message: "User login successful",
		Data: &serializers.LoginResponse{
			User:         &user,
			AuthToken:    authToken,
			RefreshToken: refreshToken,
		},
	}

	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.Error(err)
		utils.HandleInternalServerError(w, "error writing http response")
		return
	}
}

func RegisterHandler(
	w http.ResponseWriter,
	r *http.Request,
) {
	var request serializers.RegisterRequest
	err := utils.ValidateHTTPRequestPayload(w, r, &request)
	if err != nil {
		return
	}

	var userModel models.User
	if err := copier.Copy(&userModel, &request); err != nil {
		logrus.WithError(err).Error("Failed to copy request to model")
		utils.HandleInternalServerError(w, "Internal server error")
		return
	}

	encryptedPassword, _ := utils.EncryptPassword(request.Password)
	userModel.Role = models.Viewer
	userModel.Password = encryptedPassword

	createdUser, pgError := postgres.Service.DAO.Create(
		r.Context(),
		models.User{
			PhoneNumber: userModel.PhoneNumber,
		},
		userModel,
	)

	if pgError != nil {
		errorMsg := "error creating user"
		if strings.EqualFold(pgError.Err.Error(), gorm.ErrDuplicatedKey.Error()) {
			errorMsg = "account exists. please sign in"
		}

		logrus.WithError(pgError.Err).Error(errorMsg)
		postgres.Service.DAO.HardDelete(r.Context(), userModel)
		utils.HandleInternalServerError(w, errorMsg)
		return
	}

	user := createdUser.(*models.User)

	// Validate user by sending otp.

	response := utils.Response{
		Message: "User registered successfully",
		Data: &serializers.RegisterResponse{
			User: user,
		},
	}
	if err := utils.WriteHTTPResponse(w, response, http.StatusOK); err != nil {
		logrus.Error(err)
		utils.HandleInternalServerError(w, "error writing http response")
	}
}
