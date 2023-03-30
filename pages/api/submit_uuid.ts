import { NextApiRequest, NextApiResponse } from "next";
import prisma, { Prisma } from "@db/index";
import { PlayerDataAPI } from "interfaces/enka";
import { encodeBuilds } from "@utils/leaderboard-enc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: "Missing uid" });
  }

  const response = await fetch(`https://enka.network/api/uid/${uid}/`, {
    headers: {
      Agent: "GenshinBuilds/1.0.0",
    },
  });

  if (!response.ok) {
    return res.status(400).json({ statusCode: 400, message: "Invalid uid" });
  }

  const data = (await response.json()) as PlayerDataAPI;

  if (data.avatarInfoList.length <= 1) {
    return res
      .status(400)
      .json({ statusCode: 400, message: "Player profile is not public" });
  }

  try {
    let player = await prisma.player.findUnique({
      where: { uuid: data.uid },
    });

    if (!player) {
      console.log("Player not found, creating new one");
      const insert: Prisma.PlayerCreateInput = {
        uuid: data.uid,
        nickname: data.playerInfo.nickname,
        level: data.playerInfo.level,
        signature: data.playerInfo.signature,
        worldLevel: data.playerInfo.worldLevel,
        finishAchievementNum: data.playerInfo.finishAchievementNum,
        profilePictureId: data.playerInfo.profilePicture.avatarId,
        profileCostumeId: data.playerInfo.profilePicture.costumeId ?? 0,
        namecardId: data.playerInfo.nameCardId,
      };
      player = await prisma.player.create({
        data: insert,
      });

      const encodedData = encodeBuilds(data.avatarInfoList);
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
        return res
          .status(500)
          .json({ statusCode: 500, message: "error insertAvatars" });
      }
    } else {
      // Check if we got the cached player data
      if (data.ttl < 60) {
        console.log("Player data is cached, returning cached data", {
          ttl: data.ttl,
        });
        return res.status(200).json({
          uuid: data.uid,
          nickname: data.playerInfo.nickname,
          profilePictureId: data.playerInfo.profilePicture.avatarId,
          nameCardId: data.playerInfo.nameCardId,
        });
      }
      // Update player data
      const update: Prisma.PlayerUpdateInput = {
        nickname: data.playerInfo.nickname,
        level: data.playerInfo.level,
        signature: data.playerInfo.signature,
        worldLevel: data.playerInfo.worldLevel,
        finishAchievementNum: data.playerInfo.finishAchievementNum,
        profilePictureId: data.playerInfo.profilePicture.avatarId,
        profileCostumeId: data.playerInfo.profilePicture.costumeId ?? 0,
        namecardId: data.playerInfo.nameCardId,
      };

      const updatedPlayer = await prisma.player.update({
        where: { uuid: data.uid },
        data: update,
      });

      if (!updatedPlayer) {
        return res
          .status(500)
          .json({ statusCode: 500, message: "error updatedPlayer" });
      }

      const currentBuilds = await prisma.build.findMany({
        where: { playerId: player!.id },
      });

      // Update builds
      const encodedData = encodeBuilds(data.avatarInfoList);
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
          return res
            .status(500)
            .json({ statusCode: 500, message: "error updatedBuild" });
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
        return res
          .status(500)
          .json({ statusCode: 500, message: "error newBuilds" });
      }
    }

    return res.status(200).json({
      uuid: data.uid,
      nickname: data.playerInfo.nickname,
      profilePictureId: data.playerInfo.profilePicture.avatarId,
      nameCardId: data.playerInfo.nameCardId,
    });
  } catch (error) {
    console.error("[api] user", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error, please try again later",
    });
  }
}
