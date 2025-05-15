package migration

import (
	"io"
	"os"

	"ariga.io/atlas-provider-gorm/gormschema"
	userModels "github.com/kinyarasam/kinyarasam/internal/user/models"
	"github.com/sirupsen/logrus"
)

func RunMigration() error {
	var models = []any{
		// Add the table models here
		userModels.User{},
	}

	stmts, err := gormschema.New("postgres").Load(models...)
	if err != nil {
		logrus.Errorf("Migration failed to load gorm schema: %v\n", err)
		return err
	}
	io.WriteString(os.Stdout, stmts)

	logrus.Info("migration complete")
	return nil
}
