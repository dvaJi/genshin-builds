import { db } from "@db/index";
import { HSRBuild, HSRPlayer } from "@db/schema";
import { decodeBuilds } from "@utils/mihomo_enc";

import HSRData from "hsr-data";
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

  const builds = await db.query.hsrBuilds.findMany({
    orderBy: (build, { desc }) => desc(build.critValue),
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

  const playersRes = await db.query.hsrPlayers.findMany({
    where: (player, { inArray }) => inArray(player.id, playersId),
  });

  // add player to build
  const buildsWithPlayer: (HSRBuild & { player?: HSRPlayer })[] = [];
  for (const build of builds) {
    const player = playersRes.find(
      (player: any) => player.id === build.playerId
    );

    buildsWithPlayer.push({ ...build, player });
  }

  const hsr = new HSRData({ language: lang as any });
  const _characters = await hsr.characters();
  const _lightcones = await hsr.lightcones();
  const _relics = await hsr.relics();

  const decodedBuilds = await decodeBuilds(
    builds,
    _characters,
    _lightcones,
    _relics
  );

  return new Response(JSON.stringify(decodedBuilds), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
