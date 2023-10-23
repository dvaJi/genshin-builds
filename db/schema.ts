import {
  decimal,
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export type Player = typeof players.$inferSelect;
export type CreatePlayer = typeof players.$inferInsert;
export type UpdatePlayer = Partial<CreatePlayer>;
export type Build = typeof builds.$inferSelect;
export type CreateBuild = typeof builds.$inferInsert;
export type UpdateBuild = Partial<CreateBuild>;

export const players = mysqlTable("Player", {
  id: varchar("id", { length: 191 }).primaryKey(),
  uuid: text("uuid").notNull().unique("Player_uuid_key"),
  nickname: text("nickname").notNull(),
  profilePictureId: int("profilePictureId").notNull(),
  profileCostumeId: int("profileCostumeId").notNull(),
  namecardId: int("namecardId").notNull(),
  level: int("level").notNull(),
  signature: text("signature"),
  worldLevel: int("worldLevel").notNull(),
  finishAchievementNum: int("finishAchievementNum").notNull(),
  updatedAt: timestamp("timestamp").notNull().defaultNow(),
  createdAt: timestamp("timestamp").notNull().defaultNow(),
});

export const builds = mysqlTable(
  "Build",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    avatarId: int("avatarId").notNull(),
    level: int("level").notNull(),
    ascension: int("ascension").notNull(),
    fetterLevel: int("fetterLevel").notNull(),
    constellation: int("constellation").notNull(),
    skillDepotId: int("skillDepotId").notNull(),
    fightProps: text("fightProps").notNull(),
    skillLevel: text("skillLevel").notNull(),
    critValue: decimal("critValue", { precision: 65, scale: 30 }),
    critValueArtifactsOnly: decimal("critValueArtifactsOnly", {
      precision: 65,
      scale: 30,
    }),

    // Plume
    plumeId: int("plumeId"),
    plumeSetId: int("plumeSetId"),
    plumeMainStat: text("plumeMainStat"),
    plumeSubStats: text("plumeSubStats"),
    plumeSubstatsId: text("plumeSubstatsId"),
    plumeCritValue: decimal("plumeCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Flower
    flowerId: int("flowerId"),
    flowerSetId: int("flowerSetId"),
    flowerMainStat: text("flowerMainStat"),
    flowerSubStats: text("flowerSubStats"),
    flowerSubstatsId: text("flowerSubstatsId"),
    flowerCritValue: decimal("flowerCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Sands
    sandsId: int("sandsId"),
    sandsSetId: int("sandsSetId"),
    sandsMainStat: text("sandsMainStat"),
    sandsSubStats: text("sandsSubStats"),
    sandsSubstatsId: text("sandsSubstatsId"),
    sandsCritValue: decimal("sandsCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Goblet
    gobletId: int("gobletId"),
    gobletSetId: int("gobletSetId"),
    gobletMainStat: text("gobletMainStat"),
    gobletSubStats: text("gobletSubStats"),
    gobletSubstatsId: text("gobletSubstatsId"),
    gobletCritValue: decimal("gobletCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Circlet
    circletId: int("circletId"),
    circletSetId: int("circletSetId"),
    circletMainStat: text("circletMainStat"),
    circletSubStats: text("circletSubStats"),
    circletSubstatsId: text("circletSubstatsId"),
    circletCritValue: decimal("circletCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Weapon
    weaponId: int("weaponId").notNull(),
    weaponLevel: int("weaponLevel").notNull(),
    weaponPromoteLevel: int("weaponPromoteLevel").notNull(),
    weaponRefinement: int("weaponRefinement").notNull(),
    weaponStat: text("weaponStat").notNull(),

    playerId: varchar("playerId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      nameIdx: index("Build_playerId_idx").on(table.playerId),
    };
  }
);

export type HSRPlayer = typeof hsrPlayers.$inferSelect;
export type CreateHSRPlayer = typeof hsrPlayers.$inferInsert;
export type UpdateHSRPlayer = Omit<CreateHSRPlayer, "id">;
export type HSRBuild = typeof hsrBuilds.$inferSelect;
export type CreateHSRBuild = typeof hsrBuilds.$inferInsert;
export type UpdateHSRBuild = Omit<CreateHSRBuild, "id">;

export const hsrPlayers = mysqlTable("HSRPlayer", {
  id: varchar("id", { length: 191 }).primaryKey(),
  uuid: text("uuid").notNull().unique("HSRPlayer_uuid_key"),
  nickname: text("nickname").notNull(),
  profilePictureId: int("profilePictureId").notNull(),
  profileCostumeId: int("profileCostumeId").notNull(),
  namecardId: int("namecardId"),
  level: int("level").notNull(),
  signature: text("signature").notNull(),
  worldLevel: int("worldLevel").notNull(),
  finishAchievementNum: int("finishAchievementNum").notNull(),
  avatars: int("avatars").notNull(),
  lightCones: int("lightCones").notNull(),
  passAreaProgress: int("passAreaProgress").notNull(),
  friends: int("friends").notNull(),
  updatedAt: timestamp("timestamp").notNull().defaultNow(),
  createdAt: timestamp("timestamp").notNull().defaultNow(),
});

export const hsrBuilds = mysqlTable(
  "HSRBuild",
  {
    id: varchar("id", { length: 191 }).primaryKey(),
    avatarId: int("avatarId").notNull(),
    level: int("level").notNull(),
    promotion: int("promotion").notNull(),
    rank: int("rank").notNull(),
    skillLevel: text("skillLevel").notNull(),
    critValue: decimal("critValue", {
      precision: 65,
      scale: 30,
    }).notNull(),
    critValueArtifactsOnly: decimal("critValueArtifactsOnly", {
      precision: 65,
      scale: 30,
    }).notNull(),

    attributes: text("attributes"),
    additions: text("additions"),
    properties: text("properties"),

    // LightCone
    lightConeId: int("lightConeId"),
    lightConeLevel: int("lightConeLevel"),
    lightConePromotion: int("lightConePromotion"),
    lightConeRank: int("lightConeRank"),

    // Head Relic
    headRelicId: int("headRelicId"),
    headRelicSetId: int("headRelicSetId"),
    headRelicLevel: int("headRelicLevel"),
    headRelicRarity: int("headRelicRarity"),
    headMainStat: text("headMainStat"),
    headSubStats: text("headSubStats"),
    headCritValue: decimal("headCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Hands Relic
    handsRelicId: int("handsRelicId"),
    handsRelicSetId: int("handsRelicSetId"),
    handsRelicLevel: int("handsRelicLevel"),
    handsRelicRarity: int("handsRelicRarity"),
    handsMainStat: text("handsMainStat"),
    handsSubStats: text("handsSubStats"),
    handsCritValue: decimal("handsCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Body Relic
    bodyRelicId: int("bodyRelicId"),
    bodyRelicSetId: int("bodyRelicSetId"),
    bodyRelicLevel: int("bodyRelicLevel"),
    bodyRelicRarity: int("bodyRelicRarity"),
    bodyMainStat: text("bodyMainStat"),
    bodySubStats: text("bodySubStats"),
    bodyCritValue: decimal("bodyCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Feet Relic
    feetRelicId: int("feetRelicId"),
    feetRelicSetId: int("feetRelicSetId"),
    feetRelicLevel: int("feetRelicLevel"),
    feetRelicRarity: int("feetRelicRarity"),
    feetMainStat: text("feetMainStat"),
    feetSubStats: text("feetSubStats"),
    feetCritValue: decimal("feetCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Planar Sphere Relic
    planarSphereRelicId: int("planarSphereRelicId"),
    planarSphereRelicSetId: int("planarSphereRelicSetId"),
    planarSphereRelicLevel: int("planarSphereRelicLevel"),
    planarSphereRelicRarity: int("planarSphereRelicRarity"),
    planarSphereMainStat: text("planarSphereMainStat"),
    planarSphereSubStats: text("planarSphereSubStats"),
    planarSphereCritValue: decimal("planarSphereCritValue", {
      precision: 65,
      scale: 30,
    }),

    // Link Rope Relic
    linkRopeRelicId: int("linkRopeRelicId"),
    linkRopeRelicSetId: int("linkRopeRelicSetId"),
    linkRopeRelicLevel: int("linkRopeRelicLevel"),
    linkRopeRelicRarity: int("linkRopeRelicRarity"),
    linkRopeMainStat: text("linkRopeMainStat"),
    linkRopeSubStats: text("linkRopeSubStats"),
    linkRopeCritValue: decimal("linkRopeCritValue", {
      precision: 65,
      scale: 30,
    }),

    playerId: varchar("playerId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      nameIdx: index("HSRBuild_playerId_idx").on(table.playerId),
    };
  }
);
