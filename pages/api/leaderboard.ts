import GenshinData from "genshin-data";

import { db } from "@db/index";
import { Build, Player } from "@db/schema";
import { decodeBuilds } from "@utils/leaderboard-enc";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  const lang = req.nextUrl.searchParams.get("lang");
  const characters = req.nextUrl.searchParams.get("characters");

  if (!lang) {
    return new Response("Missing lang", { status: 400 });
  }

  const builds = await db.query.builds.findMany({
    orderBy: (build, { desc }) => [desc(build.critValue)],
    ...(characters
      ? {
          where: (build, { inArray }) =>
            inArray(
              build.avatarId,
              characters!.split(",").map((id) => parseInt(id))
            ),
        }
      : {}),
    limit: 20,
    offset: page ? parseInt(page) * 20 : 0,
  });

  if (!builds || builds.length === 0) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Get players, and remove duplicated
  const playersId = [...new Set(builds.map((build) => build.playerId ?? ""))];

  const playersRes = await db.query.players.findMany({
    where: (player, { inArray }) => inArray(player.id, playersId),
  });

  // add player to build
  const buildsWithPlayer: (Build & { player?: Player })[] = [];
  for (const build of builds) {
    const player = playersRes.find(
      (player: any) => player.id === build.playerId
    );

    buildsWithPlayer.push({ ...build, player });
  }

  const gi = new GenshinData({ language: lang as any });
  const _characters = await gi.characters();
  const _weapons = await gi.weapons();
  const _artifacts = await gi.artifacts();

  const decodedBuilds = await decodeBuilds(
    buildsWithPlayer,
    _characters,
    _weapons,
    _artifacts
  );

  return new Response(JSON.stringify(decodedBuilds), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
