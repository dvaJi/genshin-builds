"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import prisma, { Prisma } from "@db/index";
import { encodeBuilds as encodeEnkaBuilds } from "@utils/leaderboard-enc";
import { encodeBuilds as encodeMihomoBuilds } from "@utils/mihomo_enc";
import { PlayerDataAPI as EnkaPlayerDataAPI } from "interfaces/enka";
import { PlayerDataAPI as MiHomoPlayerDataAPI } from "interfaces/mihomo";

const submitHSRUIDSchema = z.object({
  uid: z.string().min(1),
});

export async function submitHSRUID(prevState: any, formData: FormData) {
  console.log("submitHSRUID", { prevState, formData });

  const parse = submitHSRUIDSchema.safeParse({
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

const submitGenshinUIDSchema = z.object({
  uid: z.string().min(1),
});
export async function submitGenshinUID(prevState: any, formData: FormData) {
  console.log("submitGenshinUID", { prevState, formData });
  const parse = submitGenshinUIDSchema.safeParse({
    uid: formData.get("uid") || prevState?.uid,
  });

  if (!parse.success) {
    return { message: parse.error.message };
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

const calculateResinSchema = z.object({
  currentResin: z.number().min(0),
  desiredResin: z.number().min(0),
  type: z.enum(["maxResin", "desiredResin"]),
});
export async function calculateResin(prevState: any, formData: FormData) {
  console.log("calculateResin", {
    prevState,
    formData: JSON.stringify(Object.fromEntries(formData)),
  });
  const parse = calculateResinSchema.safeParse({
    currentResin: Number(formData.get("currentResin")),
    desiredResin: Number(formData.get("desiredResin")),
    type: formData.get("type"),
  });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  const originalResin = {
    id: "original_resin",
    image: "/resin.webp",
    label: "Original Resin",
    value: 8,
  };
  const condensedResin = {
    id: "condensed_resin",
    image: "/condensed_resin.png",
    label: "Condensed Resin",
    value: 40,
  };
  const maxResin = 160;

  // 8 minute per resin * 60 seconds * 1000 millisec
  let minutePerResin = originalResin.value * 60 * 1000;

  const missingResin = maxResin - parse.data.currentResin;
  const desiredResin = parse.data.desiredResin;

  function calculateCondensedResin(nResin: number) {
    if (condensedResin.value % nResin == 0) {
      return {
        resin: 0,
        condensedResin: Math.floor(nResin / condensedResin.value),
      };
    } else {
      return {
        resin: nResin % condensedResin.value,
        condensedResin: Math.floor(nResin / condensedResin.value),
      };
    }
  }

  const resinTypeOutput = parse.data.type;

  const output = {
    ...(resinTypeOutput === "maxResin"
      ? {
          resin: missingResin,
          condensed: calculateCondensedResin(missingResin),
        }
      : {
          resin: desiredResin,
          condensed: calculateCondensedResin(desiredResin),
        }),
    millisecondsToWait:
      resinTypeOutput === "maxResin"
        ? missingResin * minutePerResin
        : desiredResin * minutePerResin,
  };

  return {
    type: resinTypeOutput,
    result: {
      originalResin,
      condensedResin,
      resin: output.resin,
      condensed: {
        resin: output.condensed.resin,
        condensedResin: output.condensed.condensedResin,
      },
      millisecondsToWait: output.millisecondsToWait,
    },
  };
}

const calculateFriendshipExpSchema = z.object({
  friendshipLevel: z.number().min(1).max(10),
  expPercentage: z.number().min(0).max(100),
  randomEvents: z.number().min(0).max(10),
  ar: z.number().min(12).max(60),
});
export async function calculateFriendshipExp(
  prevState: any,
  formData: FormData
) {
  console.log("calculateFriendshipExp", {
    prevState,
    formData: JSON.stringify(Object.fromEntries(formData)),
  });
  const parse = calculateFriendshipExpSchema.safeParse({
    friendshipLevel: Number(formData.get("friendshipLevel")),
    expPercentage: Number(formData.get("expPercentage")),
    randomEvents: Number(formData.get("randomEvents")),
    ar: Number(formData.get("ar")),
  });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  const friendshipExp = [1000, 1550, 2050, 2600, 3175, 3750, 4350, 4975, 5650];

  const commissionExp = [
    25, 25, 25, 25, 30, 30, 30, 30, 30, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35,
    40, 40, 40, 40, 40, 45, 45, 45, 45, 45, 50, 50, 50, 50, 50, 50, 50, 50, 50,
    50, 55, 55, 55, 55, 55, 60, 60, 60, 60, 60,
  ];

  const commissionBonusExp = [
    45, 45, 45, 45, 55, 55, 55, 55, 55, 55, 55, 55, 55, 65, 65, 65, 65, 65, 70,
    70, 70, 70, 70, 75, 75, 75, 75, 75, 75, 85, 85, 85, 85, 85, 85, 85, 85, 85,
    85, 95, 95, 95, 95, 95, 100, 100, 100, 100, 100,
  ];

  const expNeeded = friendshipExp
    .slice(parse.data.friendshipLevel - 1)
    .reduce((prev, cur) => prev + cur, 0);
  const expNeededAdjusted =
    expNeeded -
    (parse.data.expPercentage / 100) *
      friendshipExp[parse.data.friendshipLevel - 1];

  const currentAR = parse.data.ar;

  const commisExpDaily =
    commissionExp[currentAR - 12] * 4 + commissionBonusExp[currentAR - 12];
  const dailyResinExp = currentAR >= 35 ? 180 : 135;
  const randomEventExp = parse.data.randomEvents * 10;

  const total = commisExpDaily + dailyResinExp + randomEventExp;

  console.log(
    expNeededAdjusted,
    commisExpDaily,
    dailyResinExp,
    randomEventExp,
    total
  );

  return {
    result: {
      result: Math.ceil(expNeededAdjusted / total),
      resultSerenitea: Math.ceil(expNeededAdjusted / (total + 5 * 24)),
    },
  };
}

const calculateFatePriceSchema = z.object({
  action: z.enum(["calculateByMoney", "calculateByFate"]),
  currency: z.string().min(1),
  money: z.number().min(0),
  fate: z.number().min(0),
  "usedPrices[0]": z.number().min(0),
  "usedPrices[1]": z.number().min(0),
  "usedPrices[2]": z.number().min(0),
  "usedPrices[3]": z.number().min(0),
  "usedPrices[4]": z.number().min(0),
  "usedPrices[5]": z.number().min(0),
  "firstTime[0]": z.boolean(),
  "firstTime[1]": z.boolean(),
  "firstTime[2]": z.boolean(),
  "firstTime[3]": z.boolean(),
  "firstTime[4]": z.boolean(),
  "firstTime[5]": z.boolean(),
});
type CalculateFatePriceSchema = z.infer<typeof calculateFatePriceSchema>;
export async function calculateFatePrice(prevState: any, formData: FormData) {
  console.log("calculateFatePrice", {
    prevState,
    formData: JSON.stringify(Object.fromEntries(formData)),
  });
  const parse = calculateFatePriceSchema.safeParse({
    action: formData.get("action"),
    currency: formData.get("currency"),
    money: Number(formData.get("money")),
    fate: Number(formData.get("fate")),
    "usedPrices[0]": Number(formData.get("usedPrices[0]")),
    "usedPrices[1]": Number(formData.get("usedPrices[1]")),
    "usedPrices[2]": Number(formData.get("usedPrices[2]")),
    "usedPrices[3]": Number(formData.get("usedPrices[3]")),
    "usedPrices[4]": Number(formData.get("usedPrices[4]")),
    "usedPrices[5]": Number(formData.get("usedPrices[5]")),
    "firstTime[0]": formData.get("firstTime[0]") === "on",
    "firstTime[1]": formData.get("firstTime[1]") === "on",
    "firstTime[2]": formData.get("firstTime[2]") === "on",
    "firstTime[3]": formData.get("firstTime[3]") === "on",
    "firstTime[4]": formData.get("firstTime[4]") === "on",
    "firstTime[5]": formData.get("firstTime[5]") === "on",
  });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  const __values = [
    { amount: 60, bonus: 0, firstTime: true },
    { amount: 300, bonus: 30, firstTime: true },
    { amount: 980, bonus: 110, firstTime: true },
    { amount: 1980, bonus: 260, firstTime: true },
    { amount: 3280, bonus: 600, firstTime: true },
    { amount: 6480, bonus: 1600, firstTime: true },
  ];

  const values = Array(6)
    .fill(0)
    .map((_, i) => ({
      ...__values[i],
      price: parse.data[
        `usedPrices[${i}]` as keyof typeof parse.data
      ] as number,
      firstTime: parse.data[
        `firstTime[${i}]` as keyof typeof parse.data
      ] as boolean,
    }));

  function calculateUsable(sortOrder = true) {
    return values
      .slice()
      .map((e) => {
        const total = e.amount + (e.firstTime ? e.amount : e.bonus);
        return {
          ...e,
          total,
          perItem: e.price / (e.firstTime ? total * 2 : total),
        };
      })
      .sort(
        sortOrder
          ? (a, b) => a.perItem - b.perItem
          : (a, b) => b.total - a.total
      );
  }

  function calculate(data: CalculateFatePriceSchema, sortOrder = true) {
    const usable = calculateUsable(sortOrder);

    console.log(usable.slice());

    let currentMoney = data.money;
    const used: any[] = [];
    let total = 0;
    let totalPrice = 0;

    while (usable.length > 0) {
      const currentUsable = usable[0];
      if (currentMoney - currentUsable.price >= 0) {
        currentMoney -= currentUsable.price;
        total +=
          currentUsable.amount +
          (currentUsable.firstTime
            ? currentUsable.amount
            : currentUsable.bonus);
        totalPrice += currentUsable.price;

        const usedItem = used.find(
          (e) =>
            e.amount === currentUsable.amount &&
            e.firstTime === currentUsable.firstTime
        );
        if (usedItem) {
          usedItem.qty++;
        } else {
          used.push({ ...currentUsable, qty: 1 });
        }

        if (currentUsable.firstTime) {
          currentUsable.firstTime = false;
          calculateUsable(sortOrder);
        }
      } else {
        usable.shift();
      }
    }

    return {
      used,
      total,
      totalPrice,
    };
  }

  function calculateFate(data: CalculateFatePriceSchema, sortOrder = true) {
    const usable = calculateUsable(sortOrder);
    const usableTemp = usable.slice();

    let currentGenesis = data.fate * 160;
    const used: any[] = [];
    let total = 0;
    let totalPrice = 0;

    while (currentGenesis > 0 && usable.length > 0) {
      const currentUsable = usable[0];
      const totalGenesis =
        currentUsable.amount +
        (currentUsable.firstTime ? currentUsable.amount : currentUsable.bonus);
      if (currentGenesis - totalGenesis >= 0) {
        currentGenesis -= totalGenesis;
        total += totalGenesis;
        totalPrice += currentUsable.price;

        const usedItem = used.find(
          (e) =>
            e.amount === currentUsable.amount &&
            e.firstTime === currentUsable.firstTime
        );
        if (usedItem) {
          usedItem.qty++;
        } else {
          used.push({ ...currentUsable, qty: 1 });
        }

        if (currentUsable.firstTime) {
          currentUsable.firstTime = false;
          usableTemp.find((e) => e.amount === currentUsable.amount)!.firstTime =
            false;
          calculateUsable(sortOrder);
        }
      } else {
        usable.shift();
      }
    }

    if (currentGenesis > 0) {
      let min = Number.MAX_SAFE_INTEGER;
      let current: any = null;
      for (const u of usableTemp) {
        const usageAmount = u.amount + (u.firstTime ? u.amount : u.bonus);
        if (Math.abs(currentGenesis - usageAmount) < min) {
          current = u;
          min = Math.abs(currentGenesis - usageAmount);
        }
      }
      total +=
        current.amount + (current.firstTime ? current.amount : current.bonus);
      totalPrice += current.price;
      const usedItem = used.find(
        (e) => e.amount === current.amount && e.firstTime === current.firstTime
      );
      if (usedItem) {
        usedItem.qty++;
      } else {
        used.push({ ...current, qty: 1 });
      }
    }

    return {
      used,
      total,
      totalPrice,
    };
  }

  if (parse.data.action === "calculateByMoney") {
    const res1 = calculate(parse.data, true);
    const res2 = calculate(parse.data, false);
    if (res1.total > res2.total) {
      return {
        result: {
          data: res1.used,
          resultTotal: res1.total,
          resultTotalPrice: res1.totalPrice,
        },
      };
    } else {
      return {
        result: {
          data: res2.used,
          resultTotal: res2.total,
          resultTotalPrice: res2.totalPrice,
        },
      };
    }
  }

  if (parse.data.action === "calculateByFate") {
    const res1 = calculateFate(parse.data, true);
    const res2 = calculateFate(parse.data, false);

    if (res1.total > res2.total) {
      return {
        result: {
          data: res1.used,
          resultTotal: res1.total,
          resultTotalPrice: res1.totalPrice,
        },
      };
    } else {
      return {
        result: {
          data: res2.used,
          resultTotal: res2.total,
          resultTotalPrice: res2.totalPrice,
        },
      };
    }
  }

  return {
    result: {
      data: [],
      resultTotal: 0,
      resultTotalPrice: 0,
    },
  };
}

const calculateFateCountSchema = z.object({
  intertwinedFate: z.number().min(0),
  starglitter: z.number().min(0),
  stardust: z.number().min(0),
  primogem: z.number().min(0),
  genesisCrystal: z.number().min(0),
  welkinMoon: z.number().min(0),
  daysUntilPull: z.number().min(0),
  stardustLeft: z.number().min(0),
});
export async function calculateFateCount(prevState: any, formData: FormData) {
  console.log("calculateFateCount", {
    prevState,
    formData: JSON.stringify(Object.fromEntries(formData)),
  });
  const parse = calculateFateCountSchema.safeParse({
    intertwinedFate: Number(formData.get("intertwinedFate")),
    starglitter: Number(formData.get("starglitter")),
    stardust: Number(formData.get("stardust")),
    primogem: Number(formData.get("primogem")),
    genesisCrystal: Number(formData.get("genesisCrystal")),
    welkinMoon: Number(formData.get("welkinMoon")),
    daysUntilPull: Number(formData.get("daysUntilPull")),
    stardustLeft: Number(formData.get("stardustLeft")),
  });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  const {
    intertwinedFate,
    starglitter,
    stardust,
    daysUntilPull,
    stardustLeft,
    primogem,
    genesisCrystal,
    welkinMoon,
  } = parse.data;

  const data = [];
  let totalPrimogem = 0;

  if (intertwinedFate > 0) {
    totalPrimogem += intertwinedFate * 160;
    data.push({
      name: "intertwinedFate",
      image: "/intertwined_fate.webp",
      amount: intertwinedFate,
      total: intertwinedFate * 160,
    });
  }

  if (starglitter > 0) {
    totalPrimogem += Math.floor(starglitter / 5) * 160;
    data.push({
      name: "starglitter",
      image: "/starglitter.webp",
      amount: starglitter,
      total: Math.floor(starglitter / 5) * 160,
    });
  }

  if (stardust > 0) {
    let dateNow = dayjs();
    let monthPull = dateNow.add(daysUntilPull, "day").startOf("month");
    let monthDiff = monthPull.diff(dateNow, "month");
    let maxStardustFate = monthDiff * 5 + stardustLeft;
    const total = Math.min(Math.floor(stardust / 75), maxStardustFate) * 160;
    totalPrimogem += total;
    data.push({
      name: "starglitter",
      image: "/starglitter.png",
      amount: starglitter,
      total,
    });
  }

  if (primogem > 0) {
    totalPrimogem += primogem;
    data.push({
      name: "primogem",
      image: "/primogem.png",
      amount: primogem,
      total: primogem,
    });
  }
  if (genesisCrystal > 0) {
    totalPrimogem += genesisCrystal;
    data.push({
      name: "genesisCrystal",
      image: "/genesis_crystal.webp",
      amount: genesisCrystal,
      total: genesisCrystal,
    });
  }
  if (welkinMoon > 0) {
    let days = Math.min(welkinMoon, daysUntilPull);
    const total = Math.floor(days / 30) * 300 + days * 90;
    totalPrimogem += total;
    data.push({
      name: "welkinMoon",
      image: "/welkin_moon.png",
      amount: welkinMoon,
      total,
    });
  }

  if (daysUntilPull > 0) {
    let total = daysUntilPull * 60;
    totalPrimogem += total;
    data.push({
      name: "dailyCommission",
      image: "/commission.png",
      amount: daysUntilPull,
      total: total,
    });
  }

  return {
    result: {
      data,
      totalPrimogem,
    },
  };
}
