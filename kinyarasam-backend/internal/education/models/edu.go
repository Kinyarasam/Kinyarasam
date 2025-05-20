package models

import (
	"time"

	base "github.com/kinyarasam/kinyarasam/internal/core/models"
)

type Education struct {
	base.Model  `gorm:"embedded"`
	UserID      string     `json:"user_id" gorm:"type:uuid"`
	Degree      string     `json:"degree" gorm:"not null"`
	Institution string     `json:"institution" gorm:"not null"`
	StartDate   time.Time  `json:"start_date" gorm:"not null"`
	EndDate     *time.Time `json:"end_date"`
	Description string     `json:"description"`
	Grade       string     `json:"grade"`
	ImageURL    string     `json:"image_url"`
}
