import prisma from "@db/index";
import { Character, LightCone, Relic } from "@interfaces/hsr";
import { decodeBuilds, regionParse } from "@utils/mihomo_enc";
import { getHSRData } from "./dataApi";

export async function getPlayer(uid: string) {
  return prisma.hSRPlayer.findUnique({
    where: {
      uuid: uid,
    },
  });
}

export async function getBuild(lang: any, uid: string) {
  const playerData = await prisma.hSRPlayer.findUnique({
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

  const builds = await prisma.hSRBuild.findMany({
    where: {
      player: {
        id: playerData.id,
      },
    },
  });

  const characters = await getHSRData<Character[]>({
    resource: "characters",
    language: lang,
    select: [
      "_id",
      "id",
      "name",
      "rarity",
      "combat_type",
      "path",
      "faction",
      "eidolons",
      "skills",
    ],
  });
  const lightCones = await getHSRData<LightCone[]>({
    resource: "lightcones",
    language: lang,
    select: ["_id", "id", "name", "rarity"],
  });
  const relics = await getHSRData<Relic[]>({
    resource: "relics",
    language: lang,
    select: ["_id", "id", "name", "pieces", "effects"],
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
      avatars: playerData.avatars,
      lightCones: playerData.lightCones,
      passAreaProgress: playerData.passAreaProgress,
      friends: playerData.friends,
      region: regionParse(playerData.uuid),
      updatedAt: playerData.updatedAt.toString(),
      builds: await decodeBuilds(builds, characters, lightCones, relics),
    },
  };
}
