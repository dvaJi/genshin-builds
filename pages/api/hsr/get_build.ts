import prisma from "@db/index";
import HSRData from "hsr-data";
import { NextApiRequest, NextApiResponse } from "next";

import { decodeBuilds, regionParse } from "@utils/mihomo_enc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid, lang } = req.query;

  if (!uid || !lang) {
    return res.status(400).json({ error: "Missing uid or lang" });
  }

  console.log("get uid", uid);
  // const response = await getBuild(lang, uid as string);
  return res.status(200).json({ uid, lang });
}

export async function getBuild(lang: any, uid: string) {
  const hsr = new HSRData({ language: lang });
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

  const characters = await hsr.characters();
  const lightCones = await hsr.lightcones();
  const relics = await hsr.relics();

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
