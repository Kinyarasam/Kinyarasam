-- Create "educations" table
CREATE TABLE "public"."educations" (
  "id" text NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "user_id" uuid NULL,
  "degree" text NOT NULL,
  "institution" text NOT NULL,
  "start_date" timestamptz NOT NULL,
  "end_date" timestamptz NULL,
  "description" text NULL,
  "grade" text NULL,
  "image_url" text NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_educations_deleted_at" to table: "educations"
CREATE INDEX "idx_educations_deleted_at" ON "public"."educations" ("deleted_at");
