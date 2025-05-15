package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Error struct {
	Key   string `json:"key"`
	Error string `json:"error"`
}

type Model struct {
	Id        string         `json:"id" gorm:"primarykey;default:gen_random_uuid()"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

func (u *Model) BeforeCreate(tx *gorm.DB) (err error) {
	if u.Id == "" {
		u.Id = uuid.NewString()
	}
	return
}
