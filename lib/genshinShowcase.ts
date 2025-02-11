import { eq } from "drizzle-orm";

import { Artifact, Character, Weapon } from "@interfaces/genshin";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";

import { getGenshinData } from "./dataApi";
import { db } from "./db";
import { builds, players } from "./db/schema";

export async function getPlayer(uid: string) {
  return db.select().from(players).where(eq(players.uuid, uid));
}

export async function getBuild(lang: any, uid: string) {
  const _playerData = await getPlayer(uid);

  if (!_playerData || !_playerData.length) {
    return {
      code: 404,
      data: {
        error: "Player not found",
      },
    };
  }

  const playerData = _playerData[0];

  const buildsData = await db
    .select()
    .from(builds)
    .where(eq(builds.playerId, playerData.id));

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: lang,
    select: ["_id", "id", "name", "rarity"],
  });
  const weapons = await getGenshinData<Weapon[]>({
    resource: "weapons",
    language: lang,
    select: ["_id", "id", "name", "rarity"],
  });
  const artifacts = await getGenshinData<Artifact[]>({
    resource: "artifacts",
    language: lang,
    select: [
      "_id",
      "id",
      "name",
      "max_rarity",
      "flower",
      "plume",
      "sands",
      "goblet",
      "circlet",
    ],
  });

  return {
    code: 200,
    data: {
      uuid: playerData.uuid,
      nickname: playerData.nickname,
      profilePictureId: playerData.profilePictureId,
      profileCostumeId: playerData.profileCostumeId,
      namecardId: playerData.namecardId,
      level: playerData.level,
      signature: playerData.signature,
      worldLevel: playerData.worldLevel,
      finishAchievementNum: playerData.finishAchievementNum,
      region: regionParse(playerData.uuid),
      updatedAt: playerData.updatedAt.toString(),
      builds: await decodeBuilds(buildsData, characters, weapons, artifacts),
    },
  };
}
