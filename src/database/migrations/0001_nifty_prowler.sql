CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organisation" text NOT NULL,
	"nin" numeric NOT NULL,
	"otp" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" text NOT NULL,
	"dob" date NOT NULL,
	"gender" text NOT NULL,
	"state" text NOT NULL,
	"lga" text NOT NULL,
	"terms" boolean NOT NULL,
	CONSTRAINT "users_nin_unique" UNIQUE("nin"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
