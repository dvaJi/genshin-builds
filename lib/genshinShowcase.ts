import { Artifact, Character, Weapon } from "@interfaces/genshin";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";
import { eq } from "drizzle-orm";
import { getGenshinData } from "./dataApi";
import { db } from "./db";
import { builds, players } from "./db/schema";

export async function getPlayer(uid: string) {
  return db.query.players.findFirst({
    where: eq(players.uuid, uid),
  });
}

export async function getBuild(lang: any, uid: string) {
  const playerData = await getPlayer(uid);

  if (!playerData) {
    return {
      code: 404,
      data: {
        error: "Player not found",
      },
    };
  }

  const buildsData = await db.query.builds.findMany({
    where: eq(builds.playerId, playerData.id),
  });

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
