import { getServerSession } from "next-auth";

import { authOptions } from "@lib/auth";
import { getPosts } from "@lib/blog";
import { NextRequest, NextResponse } from "next/server";

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

  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get("lang");
  const game = searchParams.get("game");
  const showDrafts = searchParams.get("showDrafts");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  const options = {
    page: parseInt(page ?? "1") || 1,
    limit: parseInt(limit ?? "10") || 10,
    showDrafts: showDrafts === "true",
  };

  const data = await getPosts(game, lang, options);
  return NextResponse.json(data);
}
