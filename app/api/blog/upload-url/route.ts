import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { authOptions } from "@lib/auth";
import { bucketName, getUploadUrl } from "@utils/s3-client";

const schema = z.object({
  game: z.string(),
  Key: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const request = schema.safeParse(body);

  if (!request.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      {
        status: 400,
      }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const finalPath = `${request.data.game}/blog/${request.data.Key}`;

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

  return NextResponse.json({
    uploadUrl: post,
    imageUrl: `/blog/${request.data.Key}`,
  });
}
