package serializers

import "time"

type CreateEducationRequest struct {
	Degree      string     `json:"degree" validate:"required"`
	Institution string     `json:"institution" validate:"required"`
	StartDate   time.Time  `json:"start_date" validate:"required"`
	EndDate     *time.Time `json:"end_date"`
	Description string     `json:"description"`
	Grade       string     `json:"grade"`
	ImageURL    string     `json:"image_url"`
}

type UpdateEducationRequest struct {
	Id          string     `json:"id" validate:"omitempty,uuid"`
	Degree      string     `json:"degree,omitempty"`
	Institution string     `json:"institution,omitempty"`
	StartDate   *time.Time `json:"start_date,omitempty"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	Description string     `json:"description,omitempty"`
	Grade       string     `json:"grade,omitempty"`
	ImageURL    string     `json:"image_url,omitempty"`
}
