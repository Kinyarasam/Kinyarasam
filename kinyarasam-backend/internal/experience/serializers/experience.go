package serializers

import "time"

type CreateExperienceRequest struct {
	Title          string     `json:"title" validate:"required"`
	Company        string     `json:"institution" validate:"required"`
	StartDate      time.Time  `json:"start_date" validate:"required"`
	EndDate        *time.Time `json:"end_date"`
	Description    string     `json:"description"`
	EmploymentType string     `json:"employment_type" validate:"oneof='FULL_TIME' 'PART_TIME' 'CONTRACT' 'FREELANCE' 'INTERNSHIP'"`
	Skills         []string   `json:"skills"`
	ImageURL       string     `json:"image_url,omitempty"`
}

type UpdateExperienceRequest struct {
	Title          string     `json:"title,omitempty"`
	Company        string     `json:"institution,omitempty"`
	Location       string     `json:"location,omitempty"`
	StartDate      *time.Time `json:"start_date,omitempty"`
	EndDate        *time.Time `json:"end_date,omitempty"`
	Description    string     `json:"description,omitempty"`
	EmploymentType string     `json:"employment_type,omitempty" validate:"omitempty,oneof=FULL_TIME PART_TIME CONTRACT FREELANCE INTERNSHIP"`
	ImageURL       string     `json:"image_url,omitempty"`
	Skills         []string   `json:"skills,omitempty"`
}

type AddSkillsRequest struct {
	Skills []string `json:"skills" validate:"required"`
}
