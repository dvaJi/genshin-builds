CREATE SCHEMA "genshinbuilds";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."account" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."builds" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar_id" integer NOT NULL,
	"level" integer NOT NULL,
	"ascension" integer NOT NULL,
	"fetterLevel" integer NOT NULL,
	"constellation" integer NOT NULL,
	"skill_depot_id" integer NOT NULL,
	"fight_props" text NOT NULL,
	"skill_level" text NOT NULL,
	"crit_value" real DEFAULT 0 NOT NULL,
	"crit_value_artifacts_only" real DEFAULT 0 NOT NULL,
	"plume_id" integer,
	"plume_set_id" integer,
	"plume_main_stat" text,
	"plume_sub_stats" text,
	"plume_substats_id" text,
	"plume_crit_value" real,
	"flower_id" integer,
	"flower_set_id" integer,
	"flower_main_stat" text,
	"flower_sub_stats" text,
	"flower_substats_id" text,
	"flower_crit_value" real,
	"sands_id" integer,
	"sands_set_id" integer,
	"sands_main_stat" text,
	"sands_sub_stats" text,
	"sands_substats_id" text,
	"sands_crit_value" real,
	"goblet_id" integer,
	"goblet_set_id" integer,
	"goblet_main_stat" text,
	"goblet_sub_stats" text,
	"goblet_substats_id" text,
	"goblet_crit_value" real,
	"circlet_id" integer,
	"circlet_set_id" integer,
	"circlet_main_stat" text,
	"circlet_sub_stats" text,
	"circlet_substats_id" text,
	"circlet_crit_value" real,
	"weapon_id" integer NOT NULL,
	"weapon_level" integer NOT NULL,
	"weapon_promote_level" integer NOT NULL,
	"weapon_refinement" integer NOT NULL,
	"weapon_stat" text NOT NULL,
	"player_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."hsr_builds" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar_id" integer NOT NULL,
	"level" integer NOT NULL,
	"promotion" integer NOT NULL,
	"rank" integer NOT NULL,
	"skill_level" text NOT NULL,
	"crit_value" real DEFAULT 0 NOT NULL,
	"crit_value_artifacts_only" real DEFAULT 0 NOT NULL,
	"attributes" text,
	"additions" text,
	"properties" text,
	"light_cone_id" integer,
	"light_cone_level" integer,
	"light_cone_promotion" integer,
	"light_cone_rank" integer,
	"head_relic_id" integer,
	"head_relic_set_id" integer,
	"head_relic_level" integer,
	"head_relic_rarity" integer,
	"head_main_stat" text,
	"head_sub_stats" text,
	"head_crit_value" real,
	"hands_relic_id" integer,
	"hands_relic_set_id" integer,
	"hands_relic_level" integer,
	"hands_relic_rarity" integer,
	"hands_main_stat" text,
	"hands_sub_stats" text,
	"hands_crit_value" real,
	"body_relic_id" integer,
	"body_relic_set_id" integer,
	"body_relic_level" integer,
	"body_relic_rarity" integer,
	"body_main_stat" text,
	"body_sub_stats" text,
	"body_crit_value" real,
	"feet_relic_id" integer,
	"feet_relic_set_id" integer,
	"feet_relic_level" integer,
	"feet_relic_rarity" integer,
	"feet_main_stat" text,
	"feet_sub_stats" text,
	"feet_crit_value" real,
	"planar_sphere_relic_id" integer,
	"planar_sphere_relic_set_id" integer,
	"planar_sphere_relic_level" integer,
	"planar_sphere_relic_rarity" integer,
	"planarSphere_main_stat" text,
	"planarSphere_sub_stats" text,
	"planarSphere_crit_value" real,
	"link_rope_relic_id" integer,
	"link_rope_relic_set_id" integer,
	"link_rope_relic_level" integer,
	"link_rope_relic_rarity" integer,
	"link_rope_main_stat" text,
	"link_rope_sub_stats" text,
	"link_rope_crit_value" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"player_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."hsr_players" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"uuid" text NOT NULL,
	"nickname" text NOT NULL,
	"level" integer NOT NULL,
	"world_level" integer NOT NULL,
	"profile_picture_id" integer NOT NULL,
	"profile_costume_id" integer,
	"signature" text NOT NULL,
	"namecard_id" integer,
	"finish_achievement_num" integer NOT NULL,
	"avatars" integer NOT NULL,
	"light_cones" integer NOT NULL,
	"pass_area_progress" integer NOT NULL,
	"friends" integer NOT NULL,
	CONSTRAINT "hsr_players_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."invite" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invite_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "invite_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."players" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"uuid" text NOT NULL,
	"nickname" text NOT NULL,
	"profile_picture_id" integer NOT NULL,
	"profile_costume_id" integer NOT NULL,
	"namecard_id" integer NOT NULL,
	"level" integer NOT NULL,
	"signature" text NOT NULL,
	"worldLevel" integer NOT NULL,
	"finish_achievement_num" integer NOT NULL,
	"towerFloorIndex" integer DEFAULT 0,
	"towerLevelIndex" integer DEFAULT 0,
	CONSTRAINT "players_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp DEFAULT now() NOT NULL,
	"image" text,
	"globalName" text,
	"role" text DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genshinbuilds"."verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "build_critvalue_idx" ON "genshinbuilds"."builds" ("crit_value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "build_playerid_idx" ON "genshinbuilds"."builds" ("player_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hsrbuild_critvalue_idx" ON "genshinbuilds"."hsr_builds" ("crit_value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hsrbuild_playerid_idx" ON "genshinbuilds"."hsr_builds" ("player_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genshinbuilds"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "genshinbuilds"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genshinbuilds"."builds" ADD CONSTRAINT "builds_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "genshinbuilds"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genshinbuilds"."hsr_builds" ADD CONSTRAINT "hsr_builds_player_id_hsr_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "genshinbuilds"."hsr_players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genshinbuilds"."session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "genshinbuilds"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
