package serializers

import "github.com/kinyarasam/kinyarasam/internal/user/models"

type UserData struct {
	Id          string `json:"id"`
	Role        string `json:"role"`
	PhoneNumber string `json:"phone_number"`
}

type LoginRequest struct {
	PhoneNumber string `json:"phone_number"`
	Password    string `json:"password"`
}

type LoginResponse struct {
	*models.User
	AuthToken    string `json:"auth_token"`
	RefreshToken string `json:"refresh_token"`
}

type RegisterRequest struct {
	PhoneNumber string `json:"phone_number" validate:"required"`
	Password    string `json:"password" validate:"required"`
}

type RegisterResponse struct {
	*models.User
}
