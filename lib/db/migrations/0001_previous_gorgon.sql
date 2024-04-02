ALTER TABLE "genshinbuilds"."players" ADD COLUMN "show_avatar_info_list" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "genshinbuilds"."players" ADD COLUMN "show_name_card_id_list" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "genshinbuilds"."players" ADD COLUMN "characters_count" integer DEFAULT 0 NOT NULL;