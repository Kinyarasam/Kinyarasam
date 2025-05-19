package models

import (
	base "github.com/kinyarasam/kinyarasam/internal/core/models"
)

type Files struct {
	base.Model
	MimeType string `gorm:"type:varchar(50);not null" json:"mime_type"`
	Name     string `gorm:"type:varchar(255);not null" json:"name"`
	FileSize int64  `gorm:"type:bigint" json:"file_size"`
	UserId   string `gorm:"type:varchar(255);not null" json:"user_id"`
	Url      string `gorm:"not_null" json:"url"`
}
