import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@db/index";
import GenshinData from "genshin-data";
import { decodeBuilds } from "@utils/leaderboard-enc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lastID, lang } = req.query;

  if (!lang) {
    return res.status(400).json({ error: "Missing lang" });
  }

  const gi = new GenshinData({ language: lang as any });

  const cursor = lastID ? { id: lastID as string } : undefined;

  const builds = await prisma.build.findMany({
    orderBy: {
      critValue: "desc",
    },
    include: {
      player: true,
    },
    take: 20,
    skip: lastID ? 1 : 0,
    cursor,
  });

  const characters = await gi.characters();
  const weapons = await gi.weapons();
  const artifacts = await gi.artifacts();

  const decodedBuilds = await decodeBuilds(
    builds,
    characters,
    weapons,
    artifacts
  );

  return res.status(200).json(decodedBuilds);
}
