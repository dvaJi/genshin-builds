import {
  CreateBuild,
  CreatePlayer,
  UpdateBuild,
  UpdatePlayer,
  builds,
  players,
} from "@db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { db } from "@db/index";
import { encodeBuilds } from "@utils/leaderboard-enc";
import { PlayerDataAPI } from "interfaces/enka";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return new Response("Missing uid", { status: 400 });
  }

  const response = await fetch(`https://enka.network/api/uid/${uid}/`, {
    headers: {
      Agent: "GenshinBuilds/1.0.0",
    },
  });

  if (!response.ok) {
    return new Response("Invalid uid", { status: 400 });
  }

  const data = (await response.json()) as PlayerDataAPI;

  if (!data.avatarInfoList || data.avatarInfoList.length <= 1) {
    console.log("Player profile is not public", data);
    return new Response("Player profile is not public", { status: 400 });
  }

  try {
    let player = await db.query.players.findFirst({
      where: (player, { eq }) => eq(player.uuid, data.uid),
    });

    if (!player) {
      console.log(`Player [${data.uid}] not found, creating new one`);
      const insert: CreatePlayer = {
        id: createId(),
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
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      const insertPlayer = await db.insert(players).values(insert);

      if (!insertPlayer || insertPlayer.rowsAffected !== 1) {
        console.log("error insertPlayer", insertPlayer);
        return new Response("error insertPlayer", { status: 500 });
      }

      let player = { ...insert };

      const encodedData = await encodeBuilds(data.avatarInfoList);
      const insertBuilds = encodedData.map((avatar) => ({
        ...avatar,
        id: createId(),
        playerId: player!.id,
      }));

      const insertAvatars = await db.insert(builds).values(insertBuilds);

      if (
        !insertAvatars ||
        insertAvatars.rowsAffected !== insertBuilds.length
      ) {
        console.log("error insertAvatars", insertAvatars);
        return new Response("error insertAvatars", { status: 500 });
      }
    } else {
      // Check if we got the cached player data
      if (data.ttl < 60) {
        console.log("Player data is cached, returning cached data", {
          uid: data.uid,
          ttl: data.ttl,
        });
        return new Response(
          JSON.stringify({
            uuid: data.uid,
            nickname: player.nickname,
            profilePictureId: player.profilePictureId,
            nameCardId: player.namecardId,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Update player data
      const update: UpdatePlayer = {
        uuid: data.uid,
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
        updatedAt: new Date(),
      };

      console.log("Updating player data", { uid: data.uid, update });
      const updatedPlayer = await db
        .update(players)
        .set(update)
        .where(eq(players.uuid, data.uid));

      if (!updatedPlayer || updatedPlayer.rowsAffected !== 1) {
        console.log("error updatedPlayer", updatedPlayer);
        return new Response("error updatedPlayer", { status: 500 });
      }

      console.log("Get current builds", { uid: data.uid });
      const currentBuilds = await db.query.builds.findMany({
        where: (build, { eq }) => eq(build.playerId, player!.id),
      });

      // Update builds
      const encodedData = await encodeBuilds(data.avatarInfoList);
      const avatarsIds = currentBuilds.map((build) => build.avatarId);
      const updateBuilds: { where: string; data: UpdateBuild }[] = encodedData
        .filter((avatar) => avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          where: currentBuilds.find((id) => id.avatarId === avatar.avatarId)
            ?.id as string,
          data: avatar,
        }));

      console.log("Updating builds", { uid: data.uid, updateBuilds });

      for await (const updateBuild of updateBuilds) {
        const updatedBuild = await db
          .update(builds)
          .set(updateBuild.data)
          .where(eq(builds.id, updateBuild.where));

        if (!updatedBuild || updatedBuild.rowsAffected !== 1) {
          console.log("error updatedBuild", updatedBuild);
          return new Response("error updatedBuild", { status: 500 });
        }
      }

      // insert new builds

      const insertBuilds: CreateBuild[] = encodedData
        .filter((avatar) => !avatarsIds.includes(avatar.avatarId))
        .map((avatar) => ({
          ...avatar,
          id: createId(),
          playerId: player!.id,
        }));

      if (insertBuilds.length > 0) {
        console.log("Inserting new builds", { uid: data.uid });
        const newBuild = await db.insert(builds).values(insertBuilds);

        if (!newBuild || newBuild.rowsAffected !== 1) {
          console.log("error newBuild", newBuild);
          return new Response("error newBuild", { status: 500 });
        }
      }
    }

    console.log("Returning player data", { uid: data.uid });

    return new Response(
      JSON.stringify({
        uuid: data.uid,
        nickname: data.playerInfo.nickname,
        profilePictureId: data.playerInfo.profilePicture.avatarId,
        nameCardId: data.playerInfo.nameCardId,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error, please try again later", {
      status: 500,
    });
  }
}
