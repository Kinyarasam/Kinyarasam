package migration

import (
	"io"
	"os"

	"ariga.io/atlas-provider-gorm/gormschema"
	educationModels "github.com/kinyarasam/kinyarasam/internal/education/models"
	experienceModels "github.com/kinyarasam/kinyarasam/internal/experience/models"
	projectModels "github.com/kinyarasam/kinyarasam/internal/project/models"
	storageModels "github.com/kinyarasam/kinyarasam/internal/storage/models"
	userModels "github.com/kinyarasam/kinyarasam/internal/user/models"
	"github.com/sirupsen/logrus"
)

func RunMigration() error {
	var models = []any{
		// Add the table models here
		userModels.User{},
		storageModels.Files{},
		educationModels.Education{},
		projectModels.Project{},
		experienceModels.Experience{},
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
