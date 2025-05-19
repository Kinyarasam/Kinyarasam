package postgres

import (
	"context"
	"errors"
	"reflect"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Service PostgresService

type PostgresService struct {
	DAO DataAccess
}

var pg Postgres

type Postgres struct {
	db  *gorm.DB
	dsn string
}

func InitDB(dsn string) error {
	pg.dsn = dsn

	err := validateConnectionString(pg.dsn)
	if err != nil {
		return err
	}

	// Open DB connection
	db, err := Connect()
	if err != nil {
		return err
	}
	pg.db = db

	Service.DAO = &pg
	return nil
}

func Connect() (db *gorm.DB, err error) {
	db, err = gorm.Open(postgres.Open(getConnectionString()), nil)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func validateConnectionString(dsn string) error {
	if dsn == "" {
		return errors.New("connection string cannot be empty")
	}

	return nil
}

func getConnectionString() string {
	return pg.dsn
}

func (dao *Postgres) Create(
	ctx context.Context,
	condition interface{},
	model interface{},
) (interface{}, *pgError) {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(model))
	modelPtr.Elem().Set(reflect.ValueOf(model))

	tx := dao.db.Where(condition).FirstOrCreate(modelPtr.Interface())

	if tx.Error != nil {
		pgErr := MapSQLStateToErrorMessage(tx.Error)
		return nil, &pgErr
	}

	// Return the existing record and duplicate error
	if tx.RowsAffected == 0 {
		pgErr := MapSQLStateToErrorMessage(gorm.ErrDuplicatedKey)
		return modelPtr.Interface(), &pgErr
	}

	return modelPtr.Interface(), nil
}

func (dao *Postgres) Update(
	ctx context.Context,
	condition interface{},
	model interface{},
) error {
	return nil
}

func (dao *Postgres) Exists(
	ctx context.Context,
	condition interface{},
) (interface{}, error) {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(condition))

	// Call the database query using the pointer to the model
	tx := dao.db.Select("id").Where(condition).First(modelPtr.Interface())

	if tx.Error != nil {
		errMsg := MapSQLStateToErrorMessage(tx.Error)
		return "", errMsg.Err
	}

	return modelPtr.Elem().Interface(), nil
}

func (dao *Postgres) Get(
	ctx context.Context,
	condition interface{},
) (interface{}, error) {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(condition))

	// Call the database query using the pointer to the model
	tx := dao.db.Where(condition).First(modelPtr.Interface())

	if tx.Error != nil {
		errMsg := MapSQLStateToErrorMessage(tx.Error)
		return nil, errMsg.Err
	}

	return modelPtr.Elem().Interface(), nil
}

func (dao *Postgres) SoftDelete(
	ctx context.Context,
	model interface{},
) error {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(model))

	// Dereference the pointer and set the value
	modelPtr.Elem().Set(reflect.ValueOf(model))

	tx := dao.db.Delete(modelPtr.Interface(), model)

	if tx.Error != nil {
		errMsg := MapSQLStateToErrorMessage(tx.Error)
		return errMsg.Err
	}

	return nil
}

func (dao *Postgres) HardDelete(
	ctx context.Context,
	model interface{},
) error {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(model))

	// Dereference the pointer and set the value
	modelPtr.Elem().Set(reflect.ValueOf(model))

	tx := dao.db.Unscoped().Delete(modelPtr.Interface(), model)

	if tx.Error != nil {
		errMsg := MapSQLStateToErrorMessage(tx.Error)
		return errMsg.Err
	}

	return nil
}

func (dao *Postgres) BeginTransaction(
	ctx context.Context,
) (*gorm.DB, error) {
	tx := dao.db.Begin()

	if err := tx.Error; err != nil {
		return nil, err
	}

	return tx, nil
}

func (dao *Postgres) GetOrCreate(
	ctx context.Context,
	condition interface{},
	model interface{},
) (interface{}, bool, *pgError) {
	// Use reflection to create a new pointer to the type of model
	modelPtr := reflect.New(reflect.TypeOf(model))

	// Dereference the pointer and set the value
	modelPtr.Elem().Set(reflect.ValueOf(model))

	tx := dao.db.Where(condition).FirstOrCreate(modelPtr.Interface())

	if tx.Error != nil {
		errMsg := MapSQLStateToErrorMessage(tx.Error)
		return nil, false, &errMsg
	}

	exists := false
	if tx.RowsAffected == 0 {
		exists = true
	}

	return modelPtr.Interface(), exists, nil
}
