import {
  CreateHSRBuild,
  CreateHSRPlayer,
  UpdateHSRBuild,
  UpdateHSRPlayer,
  hsrBuilds,
  hsrPlayers,
} from "@db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { db } from "@db/index";
import { encodeBuilds } from "@utils/mihomo_enc";
import { PlayerDataAPI } from "interfaces/mihomo";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return new Response("Missing uid", { status: 400 });
  }

  const response = await fetch(
    `https://api.mihomo.me/sr_info_parsed/${uid}?lang=en`,
    {
      headers: {
        Agent: "GenshinBuilds/1.0.0",
      },
    }
  );

  if (response.status === 404) {
    return new Response("Player not found", { status: 404 });
  }

  if (!response.ok) {
    return new Response("Invalid uid", { status: 400 });
  }

  const data = (await response.json()) as PlayerDataAPI;

  if (!data.player.is_display) {
    console.log("Player profile is not public", data);
    return new Response("Player profile is not public", { status: 400 });
  }

  try {
    let player = await db.query.hsrPlayers.findFirst({
      where: (player, { eq }) => eq(player.uuid, data.player.uid),
    });

    if (!player) {
      console.log(`Player [${data.player.uid}] not found, creating new one`);
      const insert: CreateHSRPlayer = {
        id: createId(),
        uuid: data.player.uid,
        nickname: data.player.nickname,
        level: data.player.level,
        signature: data.player.signature ?? "",
        worldLevel: data.player.world_level,
        profilePictureId: Number(data.player.avatar.id) ?? 0,
        profileCostumeId: Number(data.player.avatar.id) ?? 0,
        // namecardId: data.player.namecard.id,
        namecardId: 0,
        friends: data.player.friend_count,
        avatars: data.player.space_info.avatar_count,
        lightCones: data.player.space_info.light_cone_count,
        passAreaProgress: data.player.space_info.pass_area_progress,
        finishAchievementNum: data.player.space_info.achievement_count,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      const insertPlayer = await db.insert(hsrPlayers).values(insert);

      if (!insertPlayer || insertPlayer.rowsAffected !== 1) {
        console.log("error insertPlayer", insertPlayer);
        return new Response("error insertPlayer", { status: 500 });
      }

      player = { ...insert } as any;

      const encodedData = await encodeBuilds(data.characters);
      const insertBuilds: CreateHSRBuild[] = encodedData.map((avatar) => ({
        ...avatar,
        playerId: player!.id,
      }));

      const insertAvatars = await db.insert(hsrBuilds).values(insertBuilds);
      if (!insertAvatars) {
        return new Response("error insertAvatars", { status: 500 });
      }
    } else {
      // TODO: Check if we got the cached player data
      // if (data.ttl < 60) {
      //   console.log("Player data is cached, returning cached data", {
      //     ttl: data.ttl,
      //   });
      //   return res.status(200).json({
      //     uuid: data.player.uid,
      //     nickname: data.player.nickname,
      //     profilePictureId: Number(data.player.avatar.id)
      //   });
      // }
      // Update player data
      const update: UpdateHSRPlayer = {
        uuid: data.player.uid,
        nickname: data.player.nickname,
        level: data.player.level,
        signature: data.player.signature ?? "",
        worldLevel: data.player.world_level,
        profilePictureId: Number(data.player.avatar.id),
        profileCostumeId: Number(data.player.avatar.id) ?? 0,
        // namecardId: data.player.namecard.id,
        namecardId: 0,
        friends: data.player.friend_count,
        avatars: data.player.space_info.avatar_count,
        lightCones: data.player.space_info.light_cone_count,
        passAreaProgress: data.player.space_info.pass_area_progress,
        finishAchievementNum: data.player.space_info.achievement_count,
      };

      const updatedPlayer = await db
        .update(hsrPlayers)
        .set(update)
        .where(eq(hsrPlayers.uuid, data.player.uid));

      if (!updatedPlayer) {
        return new Response("error updatedPlayer", { status: 500 });
      }

      console.log("Player data updated", { uuid: data.player.uid });

      const currentBuilds = await db.query.hsrBuilds.findMany({
        where: (build, { eq }) => eq(build.playerId, player!.id),
      });

      // Update builds
      const encodedData = await encodeBuilds(data.characters);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);
      const updateBuilds: { where: string; data: UpdateHSRBuild }[] =
        encodedData
          .filter((avatar) => avatarsIds.includes(avatar.avatarId))
          .map((avatar) => ({
            where:
              currentBuilds.find((id) => id.avatarId === avatar.avatarId)?.id ??
              "",
            data: avatar,
          }));

      for await (const updateBuild of updateBuilds) {
        const updatedBuild = await db
          .update(hsrBuilds)
          .set(updateBuild.data)
          .where(eq(hsrBuilds.id, updateBuild.where));

        if (!updatedBuild) {
          return new Response("error updatedBuild", { status: 500 });
        }
      }

      console.log("Builds updated", { uuid: data.player.uid });

      // insert new builds
      const insertBuilds: CreateHSRBuild[] = encodedData
        .filter((avatar) => !avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          ...avatar,
          playerId: player!.id,
        }));

      if (insertBuilds.length > 0) {
        const newBuilds = await db.insert(hsrBuilds).values(insertBuilds);

        if (!newBuilds) {
          return new Response("error newBuilds", { status: 500 });
        }

        console.log("New builds inserted", { uuid: data.player.uid });
      }
    }

    return new Response(
      JSON.stringify({
        uuid: data.player.uid,
        nickname: data.player.nickname,
        profilePictureId: Number(data.player.avatar.id),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[api] user", { uid }, error);
    return new Response("error", { status: 500 });
  }
}
