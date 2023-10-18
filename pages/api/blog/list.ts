import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prisma, { BlogPost } from "@db/index";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { lang, game, showDrafts } = req.query;

  if (!game) {
    return res.status(400).json({ error: "Missing game or lang" });
  }

  const options = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    showDrafts: showDrafts === "true",
  };

  const data = await getPosts(game as string, lang as string, options);
  return res.status(200).json(data);
}

export type PaginationOptions = {
  page: number;
  limit: number;
  sort?: "asc" | "desc";
  showDrafts?: boolean;
};

type PaginationResult = {
  data: BlogPost[];
  total: number;
  pages: number;
};

export async function getPosts(
  game: string,
  language?: string,
  options?: PaginationOptions
): Promise<PaginationResult> {
  try {
    const { page = 1, limit = 12, sort, showDrafts } = options || {};

    const data = await prisma.blogPost.findMany({
      select: {
        content: false,
        description: true,
        id: true,
        slug: true,
        title: true,
        game: true,
        tags: true,
        published: true,
        image: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        game,
        language,
        ...(showDrafts ? {} : { published: true }),
      },
      orderBy: {
        createdAt: sort || "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.blogPost.count({
      where: {
        game,
        language,
      },
    });

    const pages = Math.ceil(total / limit);

    return {
      data: <BlogPost[]>data,
      total,
      pages,
    };
  } catch (err) {
    console.log("Error getting posts", err);
    return {
      data: [],
      total: 0,
      pages: 0,
    };
  }
}
