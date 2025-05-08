package main

import (
	"github.com/kinyarasam/kinyarasam/internal/server"
	"github.com/sirupsen/logrus"
)

func main() {
	err := server.RunServer()
	if err != nil {
		logrus.WithError(err).Fatal(err)
	}
}
