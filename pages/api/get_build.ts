import GenshinData from "genshin-data";
import { NextRequest } from "next/server";

import { db } from "@db/index";
import { decodeBuilds, regionParse } from "@utils/leaderboard-enc";

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
      "content-type": "application/json",
    },
  });
}

export async function getBuild(lang: any, uid: string) {
  const gi = new GenshinData({ language: lang });
  const playerData = await db.query.players.findFirst({
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

  const builds = await db.query.builds.findMany({
    where: (build, { eq }) => eq(build.playerId, playerData.id),
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
      region: regionParse(playerData.uuid || ""),
      updatedAt: playerData.updatedAt?.toString(),
      builds: await decodeBuilds(
        builds.map((b) => ({ ...b, player: playerData })),
        characters,
        weapons,
        artifacts
      ),
    },
  };
}
