import type { Artifact, Character, Weapon } from "genshin-data";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { getGenshinData } from "@lib/dataApi";
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

  const _characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: request.data.lang,
    select: ["_id", "id", "name", "rarity"],
  });
  const _weapons = await getGenshinData<Weapon[]>({
    resource: "weapons",
    language: request.data.lang,
    select: ["_id", "id", "name", "rarity"],
  });
  const _artifacts = await getGenshinData<Artifact[]>({
    resource: "artifacts",
    language: request.data.lang,
    select: [
      "_id",
      "id",
      "name",
      "max_rarity",
      "flower",
      "plume",
      "sands",
      "goblet",
      "circlet",
    ],
  });

  const decodedBuilds = await decodeBuilds(
    builds,
    _characters,
    _weapons,
    _artifacts
  );

  return NextResponse.json(decodedBuilds);
}
