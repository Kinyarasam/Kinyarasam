-- Create "files" table
CREATE TABLE "public"."files" (
  "id" text NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "mime_type" character varying(50) NOT NULL,
  "name" character varying(255) NOT NULL,
  "file_size" bigint NULL,
  "user_id" character varying(255) NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_files_deleted_at" to table: "files"
CREATE INDEX "idx_files_deleted_at" ON "public"."files" ("deleted_at");
