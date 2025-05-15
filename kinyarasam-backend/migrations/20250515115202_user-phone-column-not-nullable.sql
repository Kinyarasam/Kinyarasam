-- Modify "users" table
ALTER TABLE "public"."users" ALTER COLUMN "phone_number" SET NOT NULL, ADD CONSTRAINT "uni_users_phone_number" UNIQUE ("phone_number");
