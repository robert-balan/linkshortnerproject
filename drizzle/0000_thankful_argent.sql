CREATE TABLE "short_links" (
	"clerk_user_id" varchar(255) NOT NULL,
	"short_code" varchar(64) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "short_links_short_code_idx" ON "short_links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "short_links_clerk_user_id_created_at_idx" ON "short_links" USING btree ("clerk_user_id","created_at");