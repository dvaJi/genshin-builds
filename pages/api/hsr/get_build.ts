import HSRData from "hsr-data";
import { NextRequest } from "next/server";

import { decodeBuilds, regionParse } from "@utils/mihomo_enc";
import { db } from "@db/index";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  const lang = req.nextUrl.searchParams.get("lang");

  if (!uid || !lang) {
    return new Response("Missing uid or lang", { status: 400 });
  }

  console.log("get uid", uid);
  // const response = await getBuild(lang, uid as string);
  return new Response(JSON.stringify({ uid, lang }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getBuild(lang: any, uid: string) {
  const hsr = new HSRData({ language: lang });
  const playerData = await db.query.hsrPlayers.findFirst({
    where: (player, { eq }) => eq(player.uuid, uid),
  });

  if (!playerData) {
    return {
      code: 404,
      data: {
        error: "Player not found",
      },
    };
  }

  const builds = await db.query.hsrBuilds.findMany({
    where: (build, { eq }) => eq(build.playerId, playerData.id),
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
      updatedAt: playerData.updatedAt?.toString(),
      builds: await decodeBuilds(builds, characters, lightCones, relics),
    },
  };
}
