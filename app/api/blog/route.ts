import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { authOptions } from "@lib/auth";
import { getPostById } from "@lib/blog";

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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      {
        status: 400,
      }
    );
  }

  const post = await getPostById(id as string);
  return NextResponse.json(post);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const body = await req.json();
  const request = schemaPost.safeParse(body);

  if (!request.success) {
    return NextResponse.json(
      { error: request.error },
      {
        status: 400,
      }
    );
  }

  await prisma.blogPost.create({
    data: {
      ...request.data,
    },
  });

  return NextResponse.json({});
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const body = await req.json();
  const request = schemaPatch.safeParse(body);

  if (!request.success) {
    return NextResponse.json(
      { error: request.error },
      {
        status: 400,
      }
    );
  }

  await prisma.blogPost.update({
    where: {
      id: request.data.id,
    },
    data: {
      ...request.data,
    },
  });

  return NextResponse.json({});
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      {
        status: 400,
      }
    );
  }

  await prisma.blogPost.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({});
}
