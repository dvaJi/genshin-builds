import type { AdapterAccount } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const players = sqliteTable("Player", {
  id: text("id").primaryKey().notNull(),
  createdAt: integer("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  uuid: text("uuid").unique().notNull(),
  nickname: text("nickname").notNull(),
  profilePictureId: integer("profilePictureId").notNull(),
  profileCostumeId: integer("profileCostumeId").notNull(),
  namecardId: integer("namecardId").notNull(),
  level: integer("level").notNull(),
  signature: text("signature").notNull(),
  worldLevel: integer("worldLevel").notNull(),
  finishAchievementNum: integer("finishAchievementNum").notNull(),
  towerFloorIndex: integer("towerFloorIndex").default(0),
  towerLevelIndex: integer("towerLevelIndex").default(0),
});

export const playersRelations = relations(players, ({ many }) => ({
  builds: many(builds),
}));

export type SelectPlayer = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const builds = sqliteTable("Build", {
  id: text("id").primaryKey().notNull(),
  avatarId: integer("avatarId").notNull(),
  level: integer("level").notNull(),
  ascension: integer("ascension").notNull(),
  fetterLevel: integer("fetterLevel").notNull(),
  constellation: integer("constellation").notNull(),
  skillDepotId: integer("skillDepotId").notNull(),
  fightProps: text("fightProps").notNull(),
  skillLevel: text("skillLevel").notNull(),
  critValue: real("critValue").default(0).notNull(),
  critValueArtifactsOnly: real("critValueArtifactsOnly").default(0).notNull(),
  plumeId: integer("plumeId"),
  plumeSetId: integer("plumeSetId"),
  plumeMainStat: text("plumeMainStat"),
  plumeSubStats: text("plumeSubStats"),
  plumeSubstatsId: text("plumeSubstatsId"),
  plumeCritValue: real("plumeCritValue"),
  flowerId: integer("flowerId"),
  flowerSetId: integer("flowerSetId"),
  flowerMainStat: text("flowerMainStat"),
  flowerSubStats: text("flowerSubStats"),
  flowerSubstatsId: text("flowerSubstatsId"),
  flowerCritValue: real("flowerCritValue"),
  sandsId: integer("sandsId"),
  sandsSetId: integer("sandsSetId"),
  sandsMainStat: text("sandsMainStat"),
  sandsSubStats: text("sandsSubStats"),
  sandsSubstatsId: text("sandsSubstatsId"),
  sandsCritValue: real("sandsCritValue"),
  gobletId: integer("gobletId"),
  gobletSetId: integer("gobletSetId"),
  gobletMainStat: text("gobletMainStat"),
  gobletSubStats: text("gobletSubStats"),
  gobletSubstatsId: text("gobletSubstatsId"),
  gobletCritValue: real("gobletCritValue"),
  circletId: integer("circletId"),
  circletSetId: integer("circletSetId"),
  circletMainStat: text("circletMainStat"),
  circletSubStats: text("circletSubStats"),
  circletSubstatsId: text("circletSubstatsId"),
  circletCritValue: real("circletCritValue"),
  weaponId: integer("weaponId").notNull(),
  weaponLevel: integer("weaponLevel").notNull(),
  weaponPromoteLevel: integer("weaponPromoteLevel").notNull(),
  weaponRefinement: integer("weaponRefinement").notNull(),
  weaponStat: text("weaponStat").notNull(),
  playerId: text("playerId").references(() => players.id),
  createdAt: integer("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const buildsRelations = relations(builds, ({ one }) => ({
  player: one(players, {
    fields: [builds.playerId],
    references: [players.id],
  }),
}));

export type SelectBuilds = typeof builds.$inferSelect;
export type InsertBuilds = typeof builds.$inferInsert;

export const hsrPlayers = sqliteTable("HSRPlayer", {
  id: text("id").primaryKey().notNull(),
  createdAt: integer("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  uuid: text("uuid").unique().notNull(),
  nickname: text("nickname").notNull(),
  level: integer("level").notNull(),
  worldLevel: integer("worldLevel").notNull(),
  profilePictureId: integer("profilePictureId").notNull(),
  profileCostumeId: integer("profileCostumeId"),
  signature: text("signature").notNull(),
  namecardId: integer("namecardId"),
  finishAchievementNum: integer("finishAchievementNum").notNull(),
  avatars: integer("avatars").notNull(),
  lightCones: integer("lightCones").notNull(),
  passAreaProgress: integer("passAreaProgress").notNull(),
  friends: integer("friends").notNull(),
});
export type SelectHSRPlayer = typeof hsrPlayers.$inferSelect;
export type InsertHSRPlayer = typeof hsrPlayers.$inferInsert;

export const hsrPlayersRelations = relations(hsrPlayers, ({ many }) => ({
  builds: many(hsrBuilds),
}));

export const hsrBuilds = sqliteTable("HSRBuild", {
  id: text("id").primaryKey().notNull(),
  avatarId: integer("avatarId").notNull(),
  level: integer("level").notNull(),
  promotion: integer("promotion").notNull(),
  rank: integer("rank").notNull(),
  skillLevel: text("skillLevel").notNull(),
  critValue: real("critValue").default(0).notNull(),
  critValueArtifactsOnly: real("critValueArtifactsOnly").default(0).notNull(),
  attributes: text("attributes"),
  additions: text("additions"),
  properties: text("properties"),
  lightConeId: integer("lightConeId"),
  lightConeLevel: integer("lightConeLevel"),
  lightConePromotion: integer("lightConePromotion"),
  lightConeRank: integer("lightConeRank"),
  headRelicId: integer("headRelicId"),
  headRelicSetId: integer("headRelicSetId"),
  headRelicLevel: integer("headRelicLevel"),
  headRelicRarity: integer("headRelicRarity"),
  headMainStat: text("headMainStat"),
  headSubStats: text("headSubStats"),
  headCritValue: real("headCritValue"),
  handsRelicId: integer("handsRelicId"),
  handsRelicSetId: integer("handsRelicSetId"),
  handsRelicLevel: integer("handsRelicLevel"),
  handsRelicRarity: integer("handsRelicRarity"),
  handsMainStat: text("handsMainStat"),
  handsSubStats: text("handsSubStats"),
  handsCritValue: real("handsCritValue"),
  bodyRelicId: integer("bodyRelicId"),
  bodyRelicSetId: integer("bodyRelicSetId"),
  bodyRelicLevel: integer("bodyRelicLevel"),
  bodyRelicRarity: integer("bodyRelicRarity"),
  bodyMainStat: text("bodyMainStat"),
  bodySubStats: text("bodySubStats"),
  bodyCritValue: real("bodyCritValue"),
  feetRelicId: integer("feetRelicId"),
  feetRelicSetId: integer("feetRelicSetId"),
  feetRelicLevel: integer("feetRelicLevel"),
  feetRelicRarity: integer("feetRelicRarity"),
  feetMainStat: text("feetMainStat"),
  feetSubStats: text("feetSubStats"),
  feetCritValue: real("feetCritValue"),
  planarSphereRelicId: integer("planarSphereRelicId"),
  planarSphereRelicSetId: integer("planarSphereRelicSetId"),
  planarSphereRelicLevel: integer("planarSphereRelicLevel"),
  planarSphereRelicRarity: integer("planarSphereRelicRarity"),
  planarSphereMainStat: text("planarSphereMainStat"),
  planarSphereSubStats: text("planarSphereSubStats"),
  planarSphereCritValue: real("planarSphereCritValue"),
  linkRopeRelicId: integer("linkRopeRelicId"),
  linkRopeRelicSetId: integer("linkRopeRelicSetId"),
  linkRopeRelicLevel: integer("linkRopeRelicLevel"),
  linkRopeRelicRarity: integer("linkRopeRelicRarity"),
  linkRopeMainStat: text("linkRopeMainStat"),
  linkRopeSubStats: text("linkRopeSubStats"),
  linkRopeCritValue: real("linkRopeCritValue"),
  playerId: text("playerId").references(() => hsrPlayers.id),
});
export type SelectHSRBuilds = typeof hsrBuilds.$inferSelect;
export type InsertHSRBuilds = typeof hsrBuilds.$inferInsert;

export const hsrBuildsRelations = relations(hsrBuilds, ({ one }) => ({
  player: one(hsrPlayers, {
    fields: [hsrBuilds.playerId],
    references: [hsrPlayers.id],
  }),
}));

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  globalName: text("globalName"),
  role: text("role").default("user"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const invites = sqliteTable("invite", {
  id: text("id").notNull().primaryKey(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  userId: text("userId").notNull().unique(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});
