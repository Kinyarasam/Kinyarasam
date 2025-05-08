package postgres

import (
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

func getConnectionString() string {
	return pg.dsn
}
