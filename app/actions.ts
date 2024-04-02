"use server";

import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@lib/db";
import {
  builds,
  hsrBuilds,
  hsrPlayers,
  players,
  type InsertBuilds,
  type InsertHSRPlayer,
  type InsertPlayer,
} from "@lib/db/schema";
import { encodeBuilds as encodeEnkaBuilds } from "@utils/leaderboard-enc";
import { encodeBuilds as encodeMihomoBuilds } from "@utils/mihomo_enc";
import type { PlayerDataAPI as EnkaPlayerDataAPI } from "interfaces/enka";
import type { PlayerDataAPI as MiHomoPlayerDataAPI } from "interfaces/mihomo";

const submitHSRUIDSchema = z.object({
  uid: z.string().min(1),
});

export async function submitHSRUID(prevState: any, formData: FormData) {
  const parse = submitHSRUIDSchema.safeParse({
    uid: formData.get("uid"),
  });
  console.log("submitHSRUID", { prevState, parse });

  if (!parse.success) {
    return { message: "Missing uid" };
  }

  const response = await fetch(
    `https://api.mihomo.me/sr_info_parsed/${parse.data.uid}?lang=en`,
    {
      headers: {
        "User-Agent": "Mar-7th/mihomo.py",
      },
      next: {
        revalidate: 0,
      },
    }
  );

  if (response.status === 404) {
    console.error("Player not found", { uid: parse.data.uid });
    return { message: "Player not found" };
  }

  if (!response.ok) {
    console.error("Error in request", {
      uid: parse.data.uid,
      response: response.status,
    });
    if (response.status === 429) {
      return {
        message: "Rate limit exceeded, please try again later",
      };
    }
    return { message: "Invalid uid" };
  }

  const data = (await response.json()) as MiHomoPlayerDataAPI;

  if (!data.player.is_display) {
    console.error("Player profile is not public", data);
    return { message: "Player profile is not public" };
  }

  try {
    let player = await db.query.hsrPlayers.findFirst({
      where: eq(hsrPlayers.uuid, data.player.uid),
    });

    if (!player) {
      console.log(`Player [${data.player.uid}] not found, creating new one`);
      const insert: InsertHSRPlayer = {
        id: createId(),
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
        passAreaProgress: data.player.space_info.universe_level,
        finishAchievementNum: data.player.space_info.achievement_count,
      };
      const insertedPlayer = await db
        .insert(hsrPlayers)
        .values(insert)
        .returning();
      if (!insertedPlayer) {
        console.error("error insertPlayer");
        // Print error to the user
        return { message: "Error creating player profile" };
      }

      player = insertedPlayer[0];

      const encodedData = await encodeMihomoBuilds(data.characters);

      const insertBuilds = encodedData.map((avatar) => ({
        ...avatar,
        id: createId(),
        playerId: player!.id,
      }));

      if (insertBuilds.length > 0) {
        const insertAvatars = await db
          .insert(hsrBuilds)
          .values(insertBuilds)
          .returning({
            insertedId: hsrBuilds.id,
          });

        if (insertAvatars.length !== insertBuilds.length) {
          console.error("error insertAvatars", insertAvatars);
          return { message: "error insertAvatars" };
        }
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

      const updatedPlayer = await db
        .update(hsrPlayers)
        .set({
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
          passAreaProgress: data.player.space_info.universe_level,
          finishAchievementNum: data.player.space_info.achievement_count,
        })
        .where(eq(hsrPlayers.uuid, data.player.uid))
        .returning({
          updatedId: hsrPlayers.id,
        });

      if (updatedPlayer.length !== 1) {
        console.error("error updatedPlayer", updatedPlayer);
        return { message: "error updatedPlayer" };
      }

      console.log("Player data updated", { uuid: data.player.uid });

      const currentBuilds = await db.query.hsrBuilds.findMany({
        where: eq(hsrBuilds.playerId, player!.id),
      });

      // Update builds
      const encodedData = await encodeMihomoBuilds(data.characters);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);

      for await (const avatar of encodedData.filter((avatar) =>
        avatarsIds.includes(avatar.avatarId)
      )) {
        const updatedBuild = await db
          .update(hsrBuilds)
          .set(avatar)
          .where(
            eq(
              hsrBuilds.id,
              currentBuilds.find((id) => id.avatarId === avatar.avatarId)?.id!
            )
          )
          .returning({
            updatedId: hsrBuilds.id,
          });

        console.log("updatedBuild", updatedBuild);
        if (updatedBuild.length !== 1) {
          console.error("error updatedBuild", updatedBuild);
          return { message: "error updatedBuild" };
        }
      }

      console.log("Builds updated", { uuid: data.player.uid });

      // insert new builds
      const insertBuilds = encodedData
        .filter((avatar) => {
          const currentBuild = currentBuilds.find(
            (build) => build.avatarId === avatar.avatarId
          );

          return !currentBuild;
        })
        .map((avatar) => ({
          ...avatar,
          id: createId(),
          playerId: player!.id,
        }));

      if (insertBuilds.length > 0) {
        const newBuilds = await db
          .insert(hsrBuilds)
          .values(insertBuilds)
          .returning({
            insertedId: hsrBuilds.id,
          });

        console.log("newBuilds", newBuilds);
        if (newBuilds.length !== insertBuilds.length) {
          console.error("error newBuilds", newBuilds);
          return { message: "error newBuilds" };
        }

        console.log("New builds inserted", { uuid: data.player.uid });
      }
    }

    console.log("Success!", { uuid: data.player.uid });
    revalidatePath(`/hsr/showcase/profile/${data.player.uid}`);
    return {
      message: "Success",
      uid: data.player.uid,
    };
  } catch (error) {
    console.log(error);
    console.error("[api] user", parse, error);
    return {
      message: "Error, please try again later",
    };
  }
}

const submitGenshinUIDSchema = z.object({
  uid: z.string().min(1),
});
export async function submitGenshinUID(prevState: any, formData: FormData) {
  const parse = submitGenshinUIDSchema.safeParse({
    uid: formData.get("uid") || prevState?.uid,
  });
  console.log("submitGenshinUID", { prevState, parse });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  const response = await fetch(process.env.GENSHIN_MHY_API!, {
    method: "POST",
    body: JSON.stringify({
      uid: parse.data.uid,
    }),
    headers: {
      Agent: "GenshinBuilds/1.0.0",
    },
    next: {
      revalidate: 0,
    },
  });

  if (response.status === 404) {
    console.log("Player not found", { uid: parse.data.uid });
    return { message: "Player not found" };
  }

  if (!response.ok) {
    console.log("Invalid uid", {
      uid: parse.data.uid,
      response: response.status,
      message: await response.text(),
    });
    return { message: "Invalid uid" };
  }

  const data = (await response.json()) as EnkaPlayerDataAPI;

  if (!data.avatarInfoList || data.avatarInfoList.length < 1) {
    console.error("Player profile has no public showcase", data);
    return {
      message: `Oops! It seems you missed a step or didn't follow the instructions "How To Get Your Character Build Showcase" correctly. Please ensure you have completed all the required steps as outlined in the instructions to proceed.`,
    };
  }

  try {
    let player = await db.query.players.findFirst({
      where: eq(players.uuid, data.uid),
    });

    if (!player) {
      console.log(`Player [${data.uid}] not found, creating new one`);
      const uniqueCharacters = () => {
        const characters = new Set();
        data.avatarInfoList.forEach((avatar) => {
          characters.add(avatar.avatarId);
        });
        data.playerInfo.showAvatarInfoList.forEach((avatar) => {
          characters.add(avatar.avatarId);
        });
        return characters.size;
      };
      const insert: InsertPlayer = {
        id: createId(),
        uuid: data.uid,
        nickname: data.playerInfo.nickname,
        level: data.playerInfo.level,
        signature: data.playerInfo.signature ?? "",
        worldLevel: data.playerInfo.worldLevel,
        finishAchievementNum: data.playerInfo.finishAchievementNum,
        towerFloorIndex: data.playerInfo.towerFloorIndex,
        towerLevelIndex: data.playerInfo.towerLevelIndex,
        profilePictureId:
          data.playerInfo.profilePicture.id ||
          data.playerInfo.profilePicture.avatarId,
        profileCostumeId:
          (data.playerInfo.profilePicture.id ||
            data.playerInfo.profilePicture.costumeId) ??
          0,
        namecardId: data.playerInfo.nameCardId,
        showAvatarInfoList: data.playerInfo.showAvatarInfoList,
        showNameCardIdList: data.playerInfo.showNameCardIdList,
        charactersCount: uniqueCharacters(),
      };
      const result = await db.insert(players).values(insert).returning({
        insertedId: hsrBuilds.id,
      });
      if (result.length === 1) {
        player = await db.query.players.findFirst({
          where: eq(players.uuid, data.uid),
        });
      } else {
        console.error("error insertPlayer", result);
        return { message: "error insertPlayer" };
      }

      const encodedData = await encodeEnkaBuilds(data.avatarInfoList);
      const insertBuilds: InsertBuilds[] = encodedData.map((avatar) => ({
        ...avatar,
        id: createId(),
        playerId: player!.id,
      }));

      if (insertBuilds.length > 0) {
        const insertAvatars = await db
          .insert(builds)
          .values(insertBuilds)
          .returning({
            insertedId: hsrBuilds.id,
          });

        if (insertAvatars.length !== insertBuilds.length) {
          console.error("error insertAvatars", insertAvatars);
          return { message: "error insertAvatars" };
        }
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

      const currentBuilds = await db.query.builds.findMany({
        where: eq(builds.playerId, player!.id),
      });

      // Update builds
      const encodedData = await encodeEnkaBuilds(data.avatarInfoList);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);
      const updateBuilds = encodedData
        .filter((avatar) => avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          where: {
            id: currentBuilds.find((id) => id.avatarId === avatar.avatarId)?.id,
          },
          data: avatar,
        }));

      for await (const updateBuild of updateBuilds) {
        const updatedBuild = await db
          .update(builds)
          .set(updateBuild.data)
          .where(eq(builds.id, updateBuild.where.id!))
          .returning({
            updatedId: hsrBuilds.id,
          });

        if (updatedBuild.length !== 1) {
          console.error("error updatedBuild", updatedBuild);
          return {
            message: "error updatedBuild",
          };
        }
      }

      // insert new builds
      const insertBuilds: InsertBuilds[] = encodedData
        .filter((avatar) => {
          const currentBuild = currentBuilds.find(
            (build) => build.avatarId === avatar.avatarId
          );

          return !currentBuild;
        })
        .map((avatar) => ({
          ...avatar,
          id: createId(),
          playerId: player!.id,
        }));

      if (insertBuilds.length > 0) {
        const newBuilds = await db
          .insert(builds)
          .values(insertBuilds)
          .returning({
            insertedId: hsrBuilds.id,
          });

        if (newBuilds.length !== insertBuilds.length) {
          console.error("error newBuilds", newBuilds);
          return { message: "error newBuilds" };
        }
      }

      // Get current characters count
      const currentAvatarsIds = await db
        .select({ avatarId: builds.avatarId })
        .from(builds)
        .where(eq(builds.playerId, player!.id))
        .groupBy(sql`${builds.avatarId}`);
      const uniqueCharacters = () => {
        const characters = new Set();
        currentAvatarsIds.forEach((avatar) => {
          characters.add(avatar.avatarId);
        });
        data.avatarInfoList.forEach((avatar) => {
          characters.add(avatar.avatarId);
        });
        data.playerInfo.showAvatarInfoList.forEach((avatar) => {
          characters.add(avatar.avatarId);
        });
        return characters.size;
      };

      // Update player data
      const updatedPlayer = await db
        .update(players)
        .set({
          nickname: data.playerInfo.nickname,
          level: data.playerInfo.level,
          signature: data.playerInfo.signature,
          worldLevel: data.playerInfo.worldLevel,
          finishAchievementNum: data.playerInfo.finishAchievementNum,
          towerFloorIndex: data.playerInfo.towerFloorIndex,
          towerLevelIndex: data.playerInfo.towerLevelIndex,
          profilePictureId:
            data.playerInfo.profilePicture.id ||
            data.playerInfo.profilePicture.avatarId,
          profileCostumeId:
            (data.playerInfo.profilePicture.id ||
              data.playerInfo.profilePicture.costumeId) ??
            0,
          namecardId: data.playerInfo.nameCardId,
          showAvatarInfoList: data.playerInfo.showAvatarInfoList,
          showNameCardIdList: data.playerInfo.showNameCardIdList,
          updatedAt: new Date(),
          charactersCount: uniqueCharacters(),
        })
        .where(eq(players.uuid, data.uid))
        .returning({
          updatedId: hsrBuilds.id,
        });

      if (updatedPlayer.length !== 1) {
        console.error("error updatedPlayer", updatedPlayer);
        return {
          message: "error updatedPlayer",
        };
      }
    }

    console.log("Success!", { uuid: data.uid });
    revalidatePath(`/profile/${data.uid}`);

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
