CREATE TABLE "genshinbuilds"."zzz_builds" (
	"id" text PRIMARY KEY NOT NULL,
	"player_id" text,
	"avatar_id" integer NOT NULL,
	"info" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genshinbuilds"."zzz_players" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"uid" text NOT NULL,
	"info" json NOT NULL,
	CONSTRAINT "zzz_players_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "genshinbuilds"."zzz_builds" ADD CONSTRAINT "zzz_builds_player_id_zzz_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "genshinbuilds"."zzz_players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "zzzbuild_playerid_idx" ON "genshinbuilds"."zzz_builds" USING btree ("player_id");