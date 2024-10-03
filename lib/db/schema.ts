import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgSchema,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const mySchema = pgSchema("genshinbuilds");

type ShowAvatarInfo = {
  avatarId: number;
  level: number;
  customeId?: number;
};

export const players = mySchema.table("players", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  uuid: text("uuid").unique().notNull(),
  nickname: text("nickname").notNull(),
  profilePictureId: integer("profile_picture_id").notNull(),
  profileCostumeId: integer("profile_costume_id").notNull(),
  namecardId: integer("namecard_id").notNull(),
  level: integer("level").notNull(),
  signature: text("signature").notNull(),
  worldLevel: integer("worldLevel"),
  finishAchievementNum: integer("finish_achievement_num").notNull(),
  towerFloorIndex: integer("towerFloorIndex").default(0),
  towerLevelIndex: integer("towerLevelIndex").default(0),
  showAvatarInfoList: json("show_avatar_info_list")
    .notNull()
    .default([] as ShowAvatarInfo[]),
  showNameCardIdList: json("show_name_card_id_list")
    .notNull()
    .default([] as number[]),
  charactersCount: integer("characters_count").notNull().default(0),
});

export const playersRelations = relations(players, ({ many }) => ({
  builds: many(builds),
}));

export type SelectPlayer = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

export const builds = mySchema.table(
  "builds",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    avatarId: integer("avatar_id").notNull(),
    level: integer("level").notNull(),
    ascension: integer("ascension").notNull(),
    fetterLevel: integer("fetterLevel").notNull(),
    constellation: integer("constellation").notNull(),
    skillDepotId: integer("skill_depot_id").notNull(),
    fightProps: text("fight_props").notNull(),
    skillLevel: text("skill_level").notNull(),
    critValue: real("crit_value").default(0).notNull(),
    critValueArtifactsOnly: real("crit_value_artifacts_only")
      .default(0)
      .notNull(),
    plumeId: integer("plume_id"),
    plumeSetId: integer("plume_set_id"),
    plumeMainStat: text("plume_main_stat"),
    plumeSubStats: text("plume_sub_stats"),
    plumeSubstatsId: text("plume_substats_id"),
    plumeCritValue: real("plume_crit_value"),
    flowerId: integer("flower_id"),
    flowerSetId: integer("flower_set_id"),
    flowerMainStat: text("flower_main_stat"),
    flowerSubStats: text("flower_sub_stats"),
    flowerSubstatsId: text("flower_substats_id"),
    flowerCritValue: real("flower_crit_value"),
    sandsId: integer("sands_id"),
    sandsSetId: integer("sands_set_id"),
    sandsMainStat: text("sands_main_stat"),
    sandsSubStats: text("sands_sub_stats"),
    sandsSubstatsId: text("sands_substats_id"),
    sandsCritValue: real("sands_crit_value"),
    gobletId: integer("goblet_id"),
    gobletSetId: integer("goblet_set_id"),
    gobletMainStat: text("goblet_main_stat"),
    gobletSubStats: text("goblet_sub_stats"),
    gobletSubstatsId: text("goblet_substats_id"),
    gobletCritValue: real("goblet_crit_value"),
    circletId: integer("circlet_id"),
    circletSetId: integer("circlet_set_id"),
    circletMainStat: text("circlet_main_stat"),
    circletSubStats: text("circlet_sub_stats"),
    circletSubstatsId: text("circlet_substats_id"),
    circletCritValue: real("circlet_crit_value"),
    weaponId: integer("weapon_id").notNull(),
    weaponLevel: integer("weapon_level").notNull(),
    weaponPromoteLevel: integer("weapon_promote_level").notNull(),
    weaponRefinement: integer("weapon_refinement").notNull(),
    weaponStat: text("weapon_stat").notNull(),
    playerId: text("player_id").references(() => players.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      nameIdx: index("build_critvalue_idx").on(table.critValue),
      playerIdX: index("build_playerid_idx").on(table.playerId),
    };
  }
);

export const buildsRelations = relations(builds, ({ one }) => ({
  player: one(players, {
    fields: [builds.playerId],
    references: [players.id],
  }),
}));

export type SelectBuilds = typeof builds.$inferSelect;
export type InsertBuilds = typeof builds.$inferInsert;

export const hsrPlayers = mySchema.table("hsr_players", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  uuid: text("uuid").unique().notNull(),
  nickname: text("nickname").notNull(),
  level: integer("level").notNull(),
  worldLevel: integer("world_level").notNull(),
  profilePictureId: integer("profile_picture_id").notNull(),
  profileCostumeId: integer("profile_costume_id"),
  signature: text("signature").notNull(),
  namecardId: integer("namecard_id"),
  finishAchievementNum: integer("finish_achievement_num").notNull(),
  avatars: integer("avatars").notNull(),
  lightCones: integer("light_cones").notNull(),
  passAreaProgress: integer("pass_area_progress").notNull(),
  friends: integer("friends").notNull(),
});
export type SelectHSRPlayer = typeof hsrPlayers.$inferSelect;
export type InsertHSRPlayer = typeof hsrPlayers.$inferInsert;

export const hsrPlayersRelations = relations(hsrPlayers, ({ many }) => ({
  builds: many(hsrBuilds),
}));

export const hsrBuilds = mySchema.table(
  "hsr_builds",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    avatarId: integer("avatar_id").notNull(),
    level: integer("level").notNull(),
    promotion: integer("promotion").notNull(),
    rank: integer("rank").notNull(),
    skillLevel: text("skill_level").notNull(),
    critValue: real("crit_value").default(0).notNull(),
    critValueArtifactsOnly: real("crit_value_artifacts_only")
      .default(0)
      .notNull(),
    attributes: text("attributes"),
    additions: text("additions"),
    properties: text("properties"),
    lightConeId: integer("light_cone_id"),
    lightConeLevel: integer("light_cone_level"),
    lightConePromotion: integer("light_cone_promotion"),
    lightConeRank: integer("light_cone_rank"),
    headRelicId: integer("head_relic_id"),
    headRelicSetId: integer("head_relic_set_id"),
    headRelicLevel: integer("head_relic_level"),
    headRelicRarity: integer("head_relic_rarity"),
    headMainStat: text("head_main_stat"),
    headSubStats: text("head_sub_stats"),
    headCritValue: real("head_crit_value"),
    handsRelicId: integer("hands_relic_id"),
    handsRelicSetId: integer("hands_relic_set_id"),
    handsRelicLevel: integer("hands_relic_level"),
    handsRelicRarity: integer("hands_relic_rarity"),
    handsMainStat: text("hands_main_stat"),
    handsSubStats: text("hands_sub_stats"),
    handsCritValue: real("hands_crit_value"),
    bodyRelicId: integer("body_relic_id"),
    bodyRelicSetId: integer("body_relic_set_id"),
    bodyRelicLevel: integer("body_relic_level"),
    bodyRelicRarity: integer("body_relic_rarity"),
    bodyMainStat: text("body_main_stat"),
    bodySubStats: text("body_sub_stats"),
    bodyCritValue: real("body_crit_value"),
    feetRelicId: integer("feet_relic_id"),
    feetRelicSetId: integer("feet_relic_set_id"),
    feetRelicLevel: integer("feet_relic_level"),
    feetRelicRarity: integer("feet_relic_rarity"),
    feetMainStat: text("feet_main_stat"),
    feetSubStats: text("feet_sub_stats"),
    feetCritValue: real("feet_crit_value"),
    planarSphereRelicId: integer("planar_sphere_relic_id"),
    planarSphereRelicSetId: integer("planar_sphere_relic_set_id"),
    planarSphereRelicLevel: integer("planar_sphere_relic_level"),
    planarSphereRelicRarity: integer("planar_sphere_relic_rarity"),
    planarSphereMainStat: text("planarSphere_main_stat"),
    planarSphereSubStats: text("planarSphere_sub_stats"),
    planarSphereCritValue: real("planarSphere_crit_value"),
    linkRopeRelicId: integer("link_rope_relic_id"),
    linkRopeRelicSetId: integer("link_rope_relic_set_id"),
    linkRopeRelicLevel: integer("link_rope_relic_level"),
    linkRopeRelicRarity: integer("link_rope_relic_rarity"),
    linkRopeMainStat: text("link_rope_main_stat"),
    linkRopeSubStats: text("link_rope_sub_stats"),
    linkRopeCritValue: real("link_rope_crit_value"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    playerId: text("player_id").references(() => hsrPlayers.id),
  },
  (table) => {
    return {
      nameIdx: index("hsrbuild_critvalue_idx").on(table.critValue),
      playerIdX: index("hsrbuild_playerid_idx").on(table.playerId),
    };
  }
);
export type SelectHSRBuilds = typeof hsrBuilds.$inferSelect;
export type InsertHSRBuilds = typeof hsrBuilds.$inferInsert;

export const hsrBuildsRelations = relations(hsrBuilds, ({ one }) => ({
  player: one(hsrPlayers, {
    fields: [hsrBuilds.playerId],
    references: [hsrPlayers.id],
  }),
}));

export const users = mySchema.table("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = mySchema.table(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
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

export const sessions = mySchema.table("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mySchema.table(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull().defaultNow(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const invites = mySchema.table("invite", {
  id: text("id").notNull().primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id").notNull().unique(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull().defaultNow(),
});
