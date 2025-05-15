server:
	go run cmd/server/main.go

migrate-apply:	
	atlas migrate apply --url "postgres://$(user):$(pwd)@localhost:5432/portfolio?sslmode=disable&search_path=public"

migrate-hash:
	atlas migrate hash

migrate-diff:
	atlas migrate diff --env gorm $(description)

build:
	go build -tags netgo -ldflags '-s -w' -o app ./cmd/server