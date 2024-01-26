import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import prisma from "@db/index";
import { authOptions } from "@lib/auth";
import { slugify2 } from "@utils/hash";

const schemaPost = z.object({
  postId: z.string().optional(),
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
  content: z.string(),
  description: z.string(),
  image: z.string(),
  language: z.string(),
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
  const language = req.nextUrl.searchParams.get("language");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      {
        status: 400,
      }
    );
  }

  const queryOptions: {
    where: {
      id: string;
    };
    include?: {
      contents: {
        where: {
          language: string;
        };
      };
    };
  } = {
    where: {
      id,
    },
  };

  if (language) {
    queryOptions.include = {
      contents: {
        where: {
          language: language,
        },
      },
    };
  }

  const post = await prisma.blogPost.findUnique(queryOptions);
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

  let post = null;

  if (request.data.postId) {
    post = await prisma.blogPost.findUnique({
      where: {
        id: request.data.postId,
      },
    });
  } else {
    post = await prisma.blogPost.create({
      data: {
        game: request.data.game,
        image: request.data.image,
        slug: slugify2(request.data.title),
        tags: request.data.tags,
        authorAvatar: request.data.authorAvatar,
        authorLink: request.data.authorLink,
        authorName: request.data.authorName,
        published: request.data.published,
      },
    });
    console.log("Post Created", post);
  }

  const contentCreated = await prisma.blogContent.create({
    data: {
      title: request.data.title,
      description: request.data.description,
      language: request.data.language,
      content: request.data.content,
      image: request.data.image,
      published: request.data.published,
      postId: post!.id,
    },
  });
  console.log(contentCreated);

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

  await prisma.blogContent.update({
    where: {
      id: request.data.id,
    },
    data: {
      title: request.data.title,
      description: request.data.description,
      content: request.data.content,
      image: request.data.image,
      language: request.data.language,
      published: request.data.published,
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

  await prisma.blogContent.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({});
}
