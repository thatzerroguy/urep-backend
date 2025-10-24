CREATE TABLE "program-info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"programme" text NOT NULL,
	"expectations" text NOT NULL,
	"knowledge" text NOT NULL,
	"organization" text NOT NULL,
	"similar_participation" text NOT NULL,
	"previous_fmyd" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "program-info" ADD CONSTRAINT "program-info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;