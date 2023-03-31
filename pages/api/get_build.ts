import { NextApiRequest, NextApiResponse } from "next";
import GenshinData from "genshin-data";
import prisma from "@db/index";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";

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
  // return res.status(response.code).json(response.data);
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
      builds: await decodeBuilds(builds, characters, weapons, artifacts),
    },
  };
}
