import prisma from "@db/index";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";
import { Artifact, Character, Weapon } from "genshin-data";
import { getGenshinData } from "./dataApi";

export async function getPlayer(uid: string) {
  return prisma.player.findUnique({
    where: {
      uuid: uid,
    },
  });
}

export async function getBuild(lang: any, uid: string) {
  const playerData = await prisma.player.findUnique({
    where: {
      uuid: uid,
    },
  });

  if (!playerData) {
    return {
      code: 404,
      data: {
        error: "Player not found",
      },
    };
  }

  const builds = await prisma.build.findMany({
    where: {
      player: {
        id: playerData.id,
      },
    },
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
      builds: await decodeBuilds(builds, characters, weapons, artifacts),
    },
  };
}
