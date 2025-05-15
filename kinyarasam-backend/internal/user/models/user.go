package models

import (
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
)

type UserRole string

const (
	Admin  UserRole = "ADMIN"
	Viewer UserRole = "VIEWER"
)

type User struct {
	base.Model `gorm:"embedded"`

	PhoneNumber string   `gorm:"unique;not null" json:"phone_number"`
	Password    []byte   `json:"-"`
	Role        UserRole `json:"role"`
	Email       string   `json:"email"`
	FirstName   string   `json:"first_name"`
	LastName    string   `json:"last_name"`
	Surname     string   `json:"surname"`
}
