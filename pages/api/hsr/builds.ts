import prisma from "@db/index";
import { decodeBuilds } from "@utils/mihomo_enc";
import HSRData from "hsr-data";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lastID, lang, characters } = req.query;

  if (!lang) {
    return res.status(400).json({ error: "Missing lang" });
  }

  const hsr = new HSRData({ language: lang as any });

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

  const builds = await prisma.hSRBuild.findMany({
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

  const _characters = await hsr.characters();
  const _lightcones = await hsr.lightcones();
  const _relics = await hsr.relics();

  const decodedBuilds = await decodeBuilds(
    builds,
    _characters,
    _lightcones,
    _relics
  );

  return res.status(200).json(decodedBuilds);
}
