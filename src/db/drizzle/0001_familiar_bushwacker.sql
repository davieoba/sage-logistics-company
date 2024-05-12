DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'processing', 'delivered');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "logistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"status" "status" DEFAULT 'pending',
	"trackingId" varchar NOT NULL,
	"pickUpDate" varchar(256) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
