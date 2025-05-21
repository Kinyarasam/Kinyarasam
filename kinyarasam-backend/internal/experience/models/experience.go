package models

import (
	"time"

	base "github.com/kinyarasam/kinyarasam/internal/core/models"
)

type EmploymentType string

const (
	FullTime   EmploymentType = "FULL_TIME"
	PartTime   EmploymentType = "PART_TIME"
	Contract   EmploymentType = "CONTRACT"
	Freelance  EmploymentType = "FREELANCE"
	Internship EmploymentType = "INTERNSHIP"
)

type Experience struct {
	base.Model
	UserID         string         `json:"user_id" gorm:"type:uuid;not null"`
	Title          string         `json:"title" gorm:"not null"`
	Company        string         `json:"company" gorm:"not null"`
	Location       string         `json:"location"`
	StartDate      time.Time      `json:"start_date" gorm:"not null"`
	EndDate        *time.Time     `json:"end_date"` // Nullable for current roles
	Description    string         `json:"description"`
	EmploymentType EmploymentType `json:"employment_type" gorm:"type:varchar(50)"`
	Skills         []string       `json:"skills" gorm:"type:text[]"`
	ImageURL       string         `json:"image_url"`
}
