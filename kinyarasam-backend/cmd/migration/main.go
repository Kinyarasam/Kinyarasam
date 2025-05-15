package main

import (
	"github.com/kinyarasam/kinyarasam/internal/migration"
	"github.com/sirupsen/logrus"
)

func main() {
	err := migration.RunMigration()
	if err != nil {
		logrus.WithField("Error", err).Fatal(err)
	}
}
