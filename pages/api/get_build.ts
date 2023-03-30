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

  const gi = new GenshinData({ language: lang as any });
  console.log("get uid", uid);

  const playerData = await prisma.player.findUnique({
    where: {
      uuid: uid as string,
    },
  });

  if (!playerData) {
    return res.status(404).json({
      error: "Player not found",
    });
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

  return res.status(200).json({
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
  });
}
