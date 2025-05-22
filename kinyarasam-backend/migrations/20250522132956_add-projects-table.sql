-- Create "experiences" table
CREATE TABLE "public"."experiences" (
  "id" text NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "user_id" uuid NOT NULL,
  "title" text NOT NULL,
  "company" text NOT NULL,
  "location" text NULL,
  "start_date" timestamptz NOT NULL,
  "end_date" timestamptz NULL,
  "description" text NULL,
  "employment_type" character varying(50) NULL,
  "skills" text[] NULL,
  "image_url" text NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_experiences_deleted_at" to table: "experiences"
CREATE INDEX "idx_experiences_deleted_at" ON "public"."experiences" ("deleted_at");
-- Create "projects" table
CREATE TABLE "public"."projects" (
  "id" text NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "user_id" uuid NOT NULL,
  "title" text NOT NULL,
  "description" text NULL,
  "tech_stack" text[] NULL,
  "git_hub_url" text NULL,
  "live_url" text NULL,
  "featured_image_id" uuid NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_projects_deleted_at" to table: "projects"
CREATE INDEX "idx_projects_deleted_at" ON "public"."projects" ("deleted_at");
