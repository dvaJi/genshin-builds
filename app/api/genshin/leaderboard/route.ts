import GenshinData from "genshin-data";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { decodeBuilds } from "@utils/leaderboard-enc";

const schema = z.object({
  lang: z.string(),
  characters: z.string().optional(),
  lastID: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = {
    lang: searchParams.get("lang"),
    characters: searchParams.get("characters"),
    lastID: searchParams.get("lastID"),
  };

  const request = schema.safeParse(params);

  if (!request.success) {
    return NextResponse.json(
      { error: request.error },
      {
        status: 400,
      }
    );
  }

  const { lastID, characters } = request.data;
  const gi = new GenshinData({ language: request.data.lang as any });
  const cursor = lastID ? { id: lastID as string } : undefined;

  const charactersFilter = characters
    ? {
        avatarId: {
          in: characters
            .toString()
            .split(",")
            .map((x) => Number(x)),
        },
      }
    : {};

  const builds = await prisma.build.findMany({
    orderBy: {
      critValue: "desc",
    },
    where: {
      ...charactersFilter,
    },
    include: {
      player: true,
    },
    take: 20,
    skip: lastID ? 1 : 0,
    cursor,
  });

  const _characters = await gi.characters();
  const _weapons = await gi.weapons();
  const _artifacts = await gi.artifacts();

  const decodedBuilds = await decodeBuilds(
    builds,
    _characters,
    _weapons,
    _artifacts
  );

  return NextResponse.json(decodedBuilds);
}
