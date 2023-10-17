import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

import prisma from "@db/index";
import { bucketName, getUploadUrl } from "@utils/s3-client";
import { authOptions } from "../auth/[...nextauth]";

const schema = z.object({
  game: z.string(),
  Key: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const request = schema.safeParse(req.body);

  if (!request.success) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const finalPath = `/${request.data.game}/blog/${request.data.Key}`;

  const post = await getUploadUrl({
    Bucket: bucketName,
    Key: finalPath,
    ACL: "public-read",
  });

  await prisma.blogImages.create({
    data: {
      game: request.data.game,
      url: `/blog/${request.data.Key}`,
      type: request.data.Key.split(".").pop() ?? "png",
      filename: request.data.Key,
      key: finalPath,
    },
  });

  return res.status(200).json({
    uploadUrl: post,
    imageUrl: `/blog/${request.data.Key}`,
  });
}
