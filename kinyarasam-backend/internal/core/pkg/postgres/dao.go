package postgres

import (
	"context"

	"gorm.io/gorm"
)

type DataAccess interface {
	Create(
		ctx context.Context,
		condition interface{},
		model interface{},
	) (interface{}, *pgError)
	Update(
		ctx context.Context,
		condition interface{},
		model interface{},
	) error
	Exists(
		ctx context.Context,
		condition interface{},
	) (interface{}, error)
	Get(
		ctx context.Context,
		condition interface{},
	) (interface{}, error)
	SoftDelete(
		ctx context.Context,
		model interface{},
	) error
	HardDelete(
		ctx context.Context,
		model interface{},
	) error
	BeginTransaction(
		ctx context.Context,
	) (*gorm.DB, error)
	GetOrCreate(
		ctx context.Context,
		condition interface{},
		model interface{},
	) (interface{}, bool, *pgError)
	GetPaginated(
		ctx context.Context,
		model interface{},
		params *PaginationParams,
	) (interface{}, error)
}
