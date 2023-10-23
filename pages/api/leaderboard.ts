import prisma from "@db/index";
import { decodeBuilds } from "@utils/leaderboard-enc";
import GenshinData from "genshin-data";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lastID, lang, characters } = req.query;

  if (!lang) {
    return res.status(400).json({ error: "Missing lang" });
  }

  const gi = new GenshinData({ language: lang as any });

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

  return res.status(200).json(decodedBuilds);
}
