package models

import (
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
	fileModels "github.com/kinyarasam/kinyarasam/internal/storage/models"
)

type Project struct {
	base.Model      `gorm:"embedded"`
	UserID          string             `json:"user_id" gorm:"type:uuid;not null"`
	Title           string             `json:"title" gorm:"not null"`
	Description     string             `json:"description"`
	TechStack       []string           `json:"tech_stack" gorm:"type:text[]"`
	GitHubURL       string             `json:"github_url"`
	LiveURL         string             `json:"live_url"`
	FeaturedImageID string             `json:"featured_image_id" gorm:"type:uuid"` // References files.id
	Images          []fileModels.Files `json:"images" gorm:"many2many:project_images;foreignKey:ID;joinForeignKey:ProjectID;References:ID;joinReferences:FileID"`
}
