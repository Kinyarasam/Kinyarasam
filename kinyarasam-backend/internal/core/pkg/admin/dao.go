package admin

import "context"

type DAO interface {
	SeedAdmin(ctx context.Context) error
}
