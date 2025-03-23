import { count, desc, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@lib/db";
import { hsrPlayers } from "@lib/db/schema";
import { regionParse } from "@utils/mihomo_enc";

export const runtime = "edge";
const ITEMS_PER_PAGE = 20;

const schema = z.object({
  page: z.number().min(1).default(1),
  region: z.string().optional(),
  uid: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = {
      page: Number(searchParams.get("page") || "1"),
      region: searchParams.get("region") || undefined,
      uid: searchParams.get("uid") || undefined,
    };

    const validatedParams = schema.safeParse(params);
    if (!validatedParams.success) {
      return NextResponse.json(
        { error: validatedParams.error },
        { status: 400 },
      );
    }

    const { page, region, uid } = validatedParams.data;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Build query filters
    let filters = [];

    // Add region filter if specified (excluding 'all')
    if (region && region !== "all") {
      // The first character of the UID determines the region
      switch (region.toLowerCase()) {
        case "na":
          filters.push(like(hsrPlayers.uuid, "6%"));
          break;
        case "eu":
          filters.push(like(hsrPlayers.uuid, "7%"));
          break;
        case "asia":
          filters.push(like(hsrPlayers.uuid, "8%"));
          break;
        case "cn":
          filters.push(like(hsrPlayers.uuid, "9%"));
          break;
      }
    }

    // Add UID filter if specified
    if (uid && uid.trim() !== "") {
      filters.push(like(hsrPlayers.uuid, `%${uid}%`));
    }

    // Create a combined filter if any filters exist
    const whereClause = filters.length > 0 ? or(...filters) : undefined;

    // Count total players for pagination info
    const totalCount = await db
      .select({
        count: count(hsrPlayers.id),
      })
      .from(hsrPlayers)
      .where(whereClause);

    // Use the query builder to fetch players with filters
    const playersData = await db.query.hsrPlayers.findMany({
      where: whereClause,
      orderBy: [desc(hsrPlayers.finishAchievementNum)],
      limit: ITEMS_PER_PAGE,
      offset: skip,
    });

    // Map the data to include the region information
    const formattedData = playersData.filter(Boolean).map((player) => ({
      uuid: player.uuid,
      nickname: player.nickname,
      region: regionParse(player.uuid),
      finishAchievementNum: player.finishAchievementNum,
      level: player.level,
      updatedAt: player.updatedAt.toISOString(),
      signature: player.signature,
      profilePictureId: player.profilePictureId,
      profileCostumeId: player.profileCostumeId,
    }));

    // Add total count to response for pagination
    return NextResponse.json({
      data: formattedData,
      totalPlayers: totalCount[0]?.count || 0,
    });
  } catch (error) {
    console.error("Error loading leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard data" },
      { status: 500 },
    );
  }
}

export type LeaderboardData = {
  uuid: string;
  nickname: string;
  region: string;
  finishAchievementNum: number;
  level: number;
  updatedAt: string;
  signature: string;
  profilePictureId: number;
  profileCostumeId: number | null;
};

export type LeaderboardResponse = {
  data: Array<LeaderboardData>;
  totalPlayers?: number;
};
