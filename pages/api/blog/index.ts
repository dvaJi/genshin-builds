import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

import prisma from "@db/index";
import { authOptions } from "../auth/[...nextauth]";

const schemaPost = z.object({
  slug: z.string(),
  game: z.string(),
  authorAvatar: z.string(),
  authorLink: z.string(),
  authorName: z.string(),
  content: z.string(),
  description: z.string(),
  image: z.string(),
  language: z.string(),
  tags: z.string(),
  title: z.string(),
  published: z.boolean(),
});

const schemaPatch = z.object({
  id: z.string(),
  game: z.string(),
  authorAvatar: z.string(),
  authorLink: z.string(),
  authorName: z.string(),
  content: z.string(),
  description: z.string(),
  image: z.string(),
  language: z.string(),
  tags: z.string(),
  title: z.string(),
  published: z.boolean(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    const post = await getPostById(id as string);

    return res.status(200).json(post);
  } else if (req.method === "POST") {
    const request = schemaPost.safeParse(req.body);

    if (!request.success) {
      return res.status(400).json({ error: request.error });
    }

    await prisma.blogPost.create({
      data: {
        ...request.data,
      },
    });

    return res.status(200).json({});
  } else if (req.method === "PATCH") {
    const request = schemaPatch.safeParse(req.body);

    if (!request.success) {
      return res.status(400).json({ error: request.error });
    }

    await prisma.blogPost.update({
      where: {
        id: request.data.id,
      },
      data: {
        ...request.data,
      },
    });

    return res.status(200).json({});
  } else if (req.method === "DELETE") {
    // Delete
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }

    await prisma.blogPost.delete({
      where: {
        id: id as string,
      },
    });

    return res.status(200).json({});
  }
}

export async function getPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: {
      id,
    },
  });
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
    },
  });

  if (!post) {
    return null;
  }

  // transform date to string
  (post as any).createdAt = post.createdAt?.toISOString() || "";
  (post as any).updatedAt = post.updatedAt?.toISOString() || "";

  return post;
}
