import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { desc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getGenshinData } from "@lib/dataApi";
import { db } from "@lib/db";
import { builds } from "@lib/db/schema";
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
    ? inArray(
        builds.avatarId,
        characters
          .toString()
          .split(",")
          .map((x) => Number(x))
      )
    : undefined;

  const buildsData = await db.query.builds.findMany({
    where: charactersFilter,
    orderBy: [desc(builds.critValue)],
    with: {
      player: true,
    },
    limit: 20,
    offset: skip,
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
    buildsData,
    _characters,
    _weapons,
    _artifacts
  );

  return NextResponse.json(decodedBuilds);
}
