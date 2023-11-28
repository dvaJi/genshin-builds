"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma, { Prisma } from "@db/index";
import { encodeBuilds as encodeEnkaBuilds } from "@utils/leaderboard-enc";
import { encodeBuilds as encodeMihomoBuilds } from "@utils/mihomo_enc";
import { PlayerDataAPI as EnkaPlayerDataAPI } from "interfaces/enka";
import { PlayerDataAPI as MiHomoPlayerDataAPI } from "interfaces/mihomo";

export async function submitHSRUID(prevState: any, formData: FormData) {
  console.log("submitHSRUID", { prevState, formData });
  const schema = z.object({
    uid: z.string().min(1),
  });
  const parse = schema.safeParse({
    uid: formData.get("uid"),
  });

  if (!parse.success) {
    return { message: "Missing uid" };
  }

  const response = await fetch(
    `https://api.mihomo.me/sr_info_parsed/${parse.data.uid}?lang=en`,
    {
      headers: {
        Agent: "GenshinBuilds/1.0.0",
      },
    }
  );

  if (response.status === 404) {
    console.log("Player not found", { uid: parse.data.uid });
    return { message: "Player not found" };
  }

  if (!response.ok) {
    console.log("Invalid uid", {
      uid: parse.data.uid,
      response: response.status,
    });
    return { message: "Invalid uid" };
  }

  const data = (await response.json()) as MiHomoPlayerDataAPI;

  if (!data.player.is_display) {
    console.log("Player profile is not public", data);
    return { message: "Player profile is not public" };
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

      const encodedData = await encodeMihomoBuilds(data.characters);
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
        return { message: "error insertAvatars" };
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
        return { message: "error updatedPlayer" };
      }

      console.log("Player data updated", { uuid: data.player.uid });

      const currentBuilds = await prisma.hSRBuild.findMany({
        where: { playerId: player!.id },
      });

      // Update builds
      const encodedData = await encodeMihomoBuilds(data.characters);
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
          return { message: "error updatedBuild" };
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
        return { message: "error newBuilds" };
      }

      console.log("New builds inserted", { uuid: data.player.uid });
    }

    console.log("Success!", { uuid: data.player.uid });
    revalidatePath(`/hsr/showcase/profile/${player.id}`);
    return {
      message: "Success",
      uid: data.player.uid,
    };
  } catch (error) {
    console.error("[api] user", { formData }, error);
    return {
      message: "Error, please try again later",
    };
  }
}

export async function submitGenshinUID(prevState: any, formData: FormData) {
  console.log("submitGenshinUID", { prevState, formData });
  const schema = z.object({
    uid: z.string().min(1),
  });
  const parse = schema.safeParse({
    uid: formData.get("uid") || prevState?.uid,
  });

  if (!parse.success) {
    return { message: "Missing uid" };
  }

  const response = await fetch(
    `https://enka.network/api/uid/${parse.data.uid}/`,
    {
      headers: {
        Agent: "GenshinBuilds/1.0.0",
      },
    }
  );

  if (response.status === 404) {
    console.log("Player not found", { uid: parse.data.uid });
    return { message: "Player not found" };
  }

  if (!response.ok) {
    console.log("Invalid uid", {
      uid: parse.data.uid,
      response: response.status,
    });
    return { message: "Invalid uid" };
  }

  const data = (await response.json()) as EnkaPlayerDataAPI;

  if (!data.avatarInfoList || data.avatarInfoList.length <= 1) {
    console.log("Player profile is not public", data);
    return { message: "Player profile is not public" };
  }

  try {
    let player = await prisma.player.findUnique({
      where: { uuid: data.uid },
    });

    if (!player) {
      console.log(`Player [${data.uid}] not found, creating new one`);
      const insert: Prisma.PlayerCreateInput = {
        uuid: data.uid,
        nickname: data.playerInfo.nickname,
        level: data.playerInfo.level,
        signature: data.playerInfo.signature ?? "",
        worldLevel: data.playerInfo.worldLevel,
        finishAchievementNum: data.playerInfo.finishAchievementNum,
        profilePictureId:
          data.playerInfo.profilePicture.id ||
          data.playerInfo.profilePicture.avatarId,
        profileCostumeId:
          (data.playerInfo.profilePicture.id ||
            data.playerInfo.profilePicture.costumeId) ??
          0,
        namecardId: data.playerInfo.nameCardId,
      };
      player = await prisma.player.create({
        data: insert,
      });

      const encodedData = await encodeEnkaBuilds(data.avatarInfoList);
      const insertBuilds: Prisma.BuildCreateManyInput[] = encodedData.map(
        (avatar) => ({
          ...avatar,
          playerId: player!.id,
        })
      );

      const insertAvatars = await prisma.build.createMany({
        data: insertBuilds,
      });
      if (!insertAvatars) {
        console.log("error insertAvatars", insertAvatars);
        return {
          message: "error insertAvatars",
        };
      }
    } else {
      // Check if we got the cached player data
      if (data.ttl < 60) {
        console.log("Player data is cached, returning cached data", {
          uid: data.uid,
          ttl: data.ttl,
        });
        return {
          message: "Success",
          uid: data.uid,
        };
      }
      // Update player data
      const update: Prisma.PlayerUpdateInput = {
        nickname: data.playerInfo.nickname,
        level: data.playerInfo.level,
        signature: data.playerInfo.signature,
        worldLevel: data.playerInfo.worldLevel,
        finishAchievementNum: data.playerInfo.finishAchievementNum,
        profilePictureId:
          data.playerInfo.profilePicture.id ||
          data.playerInfo.profilePicture.avatarId,
        profileCostumeId:
          (data.playerInfo.profilePicture.id ||
            data.playerInfo.profilePicture.costumeId) ??
          0,
        namecardId: data.playerInfo.nameCardId,
      };

      const updatedPlayer = await prisma.player.update({
        where: { uuid: data.uid },
        data: update,
      });

      if (!updatedPlayer) {
        console.log("error updatedPlayer", updatedPlayer);
        return {
          message: "error updatedPlayer",
        };
      }

      const currentBuilds = await prisma.build.findMany({
        where: { playerId: player!.id },
      });

      // Update builds
      const encodedData = await encodeEnkaBuilds(data.avatarInfoList);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);
      const updateBuilds: Prisma.BuildUpdateArgs[] = encodedData
        .filter((avatar) => avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          where: {
            id: currentBuilds.find((id) => id.avatarId === avatar.avatarId)?.id,
          },
          data: avatar,
        }));

      for await (const updateBuild of updateBuilds) {
        const updatedBuild = await prisma.build.update({
          data: updateBuild.data,
          where: updateBuild.where,
        });
        if (!updatedBuild) {
          console.log("error updatedBuild", updatedBuild);
          return {
            message: "error updatedBuild",
          };
        }
      }

      // insert new builds
      const insertBuilds: Prisma.BuildCreateManyInput[] = encodedData
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

      const newBuilds = await prisma.build.createMany({
        data: insertBuilds,
      });

      if (!newBuilds) {
        console.log("error newBuilds", newBuilds);
        return {
          message: "error newBuilds",
        };
      }
    }

    console.log("Success!", { uuid: data.uid });
    revalidatePath(`/profile/${player.id}`);

    return {
      message: "Success",
      uid: data.uid,
    };
  } catch (error) {
    console.error("[api] user", error);
    return {
      message: "Error, please try again later",
    };
  }
}
