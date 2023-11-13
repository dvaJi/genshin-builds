import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@lib/auth";
import { deleteImage, getImages } from "@lib/blog";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const game = request.nextUrl.searchParams.get("game");

  if (!game) {
    return NextResponse.json(
      { error: "Missing game" },
      {
        status: 400,
      }
    );
  }

  const page = request.nextUrl.searchParams.get("page");
  const limit = request.nextUrl.searchParams.get("limit");

  const options = {
    page: parseInt(page ?? "1") || 1,
    limit: parseInt(limit ?? "10") || 10,
  };

  const data = await getImages(game as string, options);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      {
        status: 400,
      }
    );
  }

  const data = await deleteImage(id as string);
  return NextResponse.json(data);
}

export type PaginationOptions = {
  page: number;
  limit: number;
};
