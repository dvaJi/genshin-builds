import GenshinData from "genshin-data";

import prisma from "@db/index";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";

export async function getPlayer(uid: string) {
  return prisma.player.findUnique({
    where: {
      uuid: uid,
    },
  });
}

export async function getBuild(lang: any, uid: string) {
  const gi = new GenshinData({ language: lang });
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

  const characters = await gi.characters();
  const weapons = await gi.weapons();
  const artifacts = await gi.artifacts();

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
