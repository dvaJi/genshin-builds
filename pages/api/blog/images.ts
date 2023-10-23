import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma, { BlogImages } from "@db/index";
import { authOptions } from "../auth/[...nextauth]";
import { deleteObject } from "@utils/s3-client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { game } = req.query;

    if (!game) {
      return res.status(400).json({ error: "Missing game" });
    }

    const options = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const data = await getImages(game as string, options);
    return res.status(200).json(data);
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const data = await deleteImage(id as string);
    return res.status(200).json(data);
  }
}

export type PaginationOptions = {
  page: number;
  limit: number;
};

type PaginationResult = {
  data: BlogImages[];
  total: number;
  pages: number;
};

export async function getImages(
  game: string,
  options?: PaginationOptions
): Promise<PaginationResult> {
  try {
    const { page = 1, limit = 10 } = options || {};

    const data = await prisma.blogImages.findMany({
      where: {
        game,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.blogImages.count({
      where: {
        game,
      },
    });

    const pages = Math.ceil(total / limit);

    return {
      data: <BlogImages[]>data,
      total,
      pages,
    };
  } catch (err) {
    console.log("Error getting images", err);
    return {
      data: [],
      total: 0,
      pages: 0,
    };
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    await prisma.blogImages.delete({
      where: {
        id,
      },
    });

    await deleteObject(id);

    return true;
  } catch (err) {
    console.log("Error deleting image", err);
    return false;
  }
}
