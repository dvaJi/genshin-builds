import prisma, { Prisma } from "@db/index";
import { encodeBuilds } from "@utils/mihomo_enc";
import { PlayerDataAPI } from "interfaces/mihomo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
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
    return res
      .status(404)
      .json({ statusCode: 404, message: "Player not found" });
  }

  if (!response.ok) {
    return res.status(400).json({ statusCode: 400, message: "Invalid uid" });
  }

  const data = (await response.json()) as PlayerDataAPI;

  if (!data.player.is_display) {
    console.log("Player profile is not public", data);
    return res
      .status(400)
      .json({ statusCode: 400, message: "Player profile is not public" });
  }

  try {
    let player = await prisma.hSRPlayer.findUnique({
      where: { uuid: data.player.uid },
    });

    if (!player) {
      console.log(`Player [${data.player.uid}] not found, creating new one`);
      const insert: Prisma.HSRPlayerCreateInput = {
        uuid: data.player.uid,
        nickname: data.player.nickname,
        level: data.player.level,
        signature: data.player.signature ?? "",
        worldLevel: data.player.world_level,
        profilePictureId: Number(data.player.avatar.id),
        profileCostumeId: Number(data.player.avatar.id) ?? 0,
        // namecardId: data.player.namecard.id,
        friends: data.player.friend_count,
        avatars: data.player.space_info.avatar_count,
        lightCones: data.player.space_info.light_cone_count,
        passAreaProgress: data.player.space_info.pass_area_progress,
        finishAchievementNum: data.player.space_info.achievement_count,
      };
      player = await prisma.hSRPlayer.create({
        data: insert,
      });

      const encodedData = await encodeBuilds(data.characters);
      const insertBuilds: Prisma.HSRBuildCreateManyInput[] = encodedData.map(
        (avatar) => ({
          ...avatar,
          playerId: player!.id,
        })
      );

      const insertAvatars = await prisma.hSRBuild.createMany({
        data: insertBuilds,
      });
      if (!insertAvatars) {
        return res
          .status(500)
          .json({ statusCode: 500, message: "error insertAvatars" });
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
      const update: Prisma.HSRPlayerUpdateInput = {
        nickname: data.player.nickname,
        level: data.player.level,
        signature: data.player.signature ?? "",
        worldLevel: data.player.world_level,
        profilePictureId: Number(data.player.avatar.id),
        profileCostumeId: Number(data.player.avatar.id) ?? 0,
        // namecardId: data.player.namecard.id,
        friends: data.player.friend_count,
        avatars: data.player.space_info.avatar_count,
        lightCones: data.player.space_info.light_cone_count,
        passAreaProgress: data.player.space_info.pass_area_progress,
        finishAchievementNum: data.player.space_info.achievement_count,
      };

      const updatedPlayer = await prisma.hSRPlayer.update({
        where: { uuid: data.player.uid },
        data: update,
      });

      if (!updatedPlayer) {
        return res
          .status(500)
          .json({ statusCode: 500, message: "error updatedPlayer" });
      }

      console.log("Player data updated", { uuid: data.player.uid });

      const currentBuilds = await prisma.hSRBuild.findMany({
        where: { playerId: player!.id },
      });

      // Update builds
      const encodedData = await encodeBuilds(data.characters);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);
      const updateBuilds: Prisma.HSRBuildUpdateArgs[] = encodedData
        .filter((avatar) => avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          where: {
            id: currentBuilds.find((id) => id.avatarId === avatar.avatarId)?.id,
          },
          data: avatar,
        }));

      for await (const updateBuild of updateBuilds) {
        const updatedBuild = await prisma.hSRBuild.update({
          data: updateBuild.data,
          where: updateBuild.where,
        });
        if (!updatedBuild) {
          return res
            .status(500)
            .json({ statusCode: 500, message: "error updatedBuild" });
        }
      }

      console.log("Builds updated", { uuid: data.player.uid });

      // insert new builds
      const insertBuilds: Prisma.HSRBuildCreateManyInput[] = encodedData
        .filter((avatar) => {
          const currentBuild = currentBuilds.find(
            (build) => build.avatarId === avatar.avatarId
          );

          return !currentBuild;
        })
        .map((avatar) => ({
          ...avatar,
          playerId: player!.id,
        }));

      const newBuilds = await prisma.hSRBuild.createMany({
        data: insertBuilds,
        skipDuplicates: true,
      });

      if (!newBuilds) {
        return res
          .status(500)
          .json({ statusCode: 500, message: "error newBuilds" });
      }

      console.log("New builds inserted", { uuid: data.player.uid });
    }

    return res.status(200).json({
      uuid: data.player.uid,
      nickname: data.player.nickname,
      profilePictureId: Number(data.player.avatar.id),
    });
  } catch (error) {
    console.error("[api] user", { uid }, error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error, please try again later",
    });
  }
}
