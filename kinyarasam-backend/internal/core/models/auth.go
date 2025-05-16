package models

import (
	"github.com/golang-jwt/jwt"
)

type AuthUserData struct {
	Id          string `json:"id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	IsAdmin     bool   `json:"is_admin"`
	PhoneNumber string `json:"phone_number"`
}

type AuthClaimsData struct {
	*jwt.StandardClaims
	User AuthUserData `json:"user"`
}
