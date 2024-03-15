CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Build` (
	`id` text PRIMARY KEY NOT NULL,
	`avatarId` integer NOT NULL,
	`level` integer NOT NULL,
	`ascension` integer NOT NULL,
	`fetterLevel` integer NOT NULL,
	`constellation` integer NOT NULL,
	`skillDepotId` integer NOT NULL,
	`fightProps` text NOT NULL,
	`skillLevel` text NOT NULL,
	`critValue` real DEFAULT 0 NOT NULL,
	`critValueArtifactsOnly` real DEFAULT 0 NOT NULL,
	`plumeId` integer,
	`plumeSetId` integer,
	`plumeMainStat` text,
	`plumeSubStats` text,
	`plumeSubstatsId` text,
	`plumeCritValue` real,
	`flowerId` integer,
	`flowerSetId` integer,
	`flowerMainStat` text,
	`flowerSubStats` text,
	`flowerSubstatsId` text,
	`flowerCritValue` real,
	`sandsId` integer,
	`sandsSetId` integer,
	`sandsMainStat` text,
	`sandsSubStats` text,
	`sandsSubstatsId` text,
	`sandsCritValue` real,
	`gobletId` integer,
	`gobletSetId` integer,
	`gobletMainStat` text,
	`gobletSubStats` text,
	`gobletSubstatsId` text,
	`gobletCritValue` real,
	`circletId` integer,
	`circletSetId` integer,
	`circletMainStat` text,
	`circletSubStats` text,
	`circletSubstatsId` text,
	`circletCritValue` real,
	`weaponId` integer NOT NULL,
	`weaponLevel` integer NOT NULL,
	`weaponPromoteLevel` integer NOT NULL,
	`weaponRefinement` integer NOT NULL,
	`weaponStat` text NOT NULL,
	`playerId` text,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `HSRBuild` (
	`id` text PRIMARY KEY NOT NULL,
	`avatarId` integer NOT NULL,
	`level` integer NOT NULL,
	`promotion` integer NOT NULL,
	`rank` integer NOT NULL,
	`skillLevel` text NOT NULL,
	`critValue` real DEFAULT 0 NOT NULL,
	`critValueArtifactsOnly` real DEFAULT 0 NOT NULL,
	`attributes` text,
	`additions` text,
	`properties` text,
	`lightConeId` integer,
	`lightConeLevel` integer,
	`lightConePromotion` integer,
	`lightConeRank` integer,
	`headRelicId` integer,
	`headRelicSetId` integer,
	`headRelicLevel` integer,
	`headRelicRarity` integer,
	`headMainStat` text,
	`headSubStats` text,
	`headCritValue` real,
	`handsRelicId` integer,
	`handsRelicSetId` integer,
	`handsRelicLevel` integer,
	`handsRelicRarity` integer,
	`handsMainStat` text,
	`handsSubStats` text,
	`handsCritValue` real,
	`bodyRelicId` integer,
	`bodyRelicSetId` integer,
	`bodyRelicLevel` integer,
	`bodyRelicRarity` integer,
	`bodyMainStat` text,
	`bodySubStats` text,
	`bodyCritValue` real,
	`feetRelicId` integer,
	`feetRelicSetId` integer,
	`feetRelicLevel` integer,
	`feetRelicRarity` integer,
	`feetMainStat` text,
	`feetSubStats` text,
	`feetCritValue` real,
	`planarSphereRelicId` integer,
	`planarSphereRelicSetId` integer,
	`planarSphereRelicLevel` integer,
	`planarSphereRelicRarity` integer,
	`planarSphereMainStat` text,
	`planarSphereSubStats` text,
	`planarSphereCritValue` real,
	`linkRopeRelicId` integer,
	`linkRopeRelicSetId` integer,
	`linkRopeRelicLevel` integer,
	`linkRopeRelicRarity` integer,
	`linkRopeMainStat` text,
	`linkRopeSubStats` text,
	`linkRopeCritValue` real,
	`playerId` text,
	FOREIGN KEY (`playerId`) REFERENCES `HSRPlayer`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `HSRPlayer` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`uuid` text NOT NULL,
	`nickname` text NOT NULL,
	`level` integer NOT NULL,
	`worldLevel` integer NOT NULL,
	`profilePictureId` integer NOT NULL,
	`profileCostumeId` integer,
	`signature` text NOT NULL,
	`namecardId` integer,
	`finishAchievementNum` integer NOT NULL,
	`avatars` integer NOT NULL,
	`lightCones` integer NOT NULL,
	`passAreaProgress` integer NOT NULL,
	`friends` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invite` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Player` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`uuid` text NOT NULL,
	`nickname` text NOT NULL,
	`profilePictureId` integer NOT NULL,
	`profileCostumeId` integer NOT NULL,
	`namecardId` integer NOT NULL,
	`level` integer NOT NULL,
	`signature` text NOT NULL,
	`worldLevel` integer NOT NULL,
	`finishAchievementNum` integer NOT NULL,
	`towerFloorIndex` integer DEFAULT 0,
	`towerLevelIndex` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`globalName` text,
	`role` text DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `HSRPlayer_uuid_unique` ON `HSRPlayer` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `invite_userId_unique` ON `invite` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `invite_token_unique` ON `invite` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `Player_uuid_unique` ON `Player` (`uuid`);