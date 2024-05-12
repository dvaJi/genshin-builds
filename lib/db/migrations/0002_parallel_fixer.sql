ALTER TABLE "genshinbuilds"."account" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "genshinbuilds"."account" DROP CONSTRAINT "account_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "genshinbuilds"."players" ALTER COLUMN "worldLevel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "genshinbuilds"."session" ALTER COLUMN "expires" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "genshinbuilds"."user" ALTER COLUMN "emailVerified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "genshinbuilds"."user" ALTER COLUMN "emailVerified" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genshinbuilds"."account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "genshinbuilds"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "genshinbuilds"."user" DROP COLUMN IF EXISTS "globalName";--> statement-breakpoint
ALTER TABLE "genshinbuilds"."user" DROP COLUMN IF EXISTS "role";