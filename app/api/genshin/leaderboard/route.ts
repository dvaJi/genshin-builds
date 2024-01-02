import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { getGenshinData } from "@lib/dataApi";
import { decodeBuilds } from "@utils/leaderboard-enc";

const schema = z.object({
  lang: z.string(),
  characters: z.string().optional(),
  page: z.number().min(1),
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = {
    lang: searchParams.get("lang"),
    characters: searchParams.get("characters"),
    page: Number(searchParams.get("page")),
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

  const { page, characters } = request.data;
  const skip = (page - 1) * 20;

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
    skip,
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
