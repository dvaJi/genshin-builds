// https://enka.network/api/uid/605820049/

import { NextApiRequest, NextApiResponse } from "next";
import prisma, { Prisma } from "@db/index";
import { CharactersAPI, PlayerDataAPI } from "interfaces/enka";
import { ENKA_NAMES, REAL_SUBSTAT_VALUES, STAT_NAMES } from "@utils/substats";

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
    return res.status(400).json({ error: "Invalid uid" });
  }

  const data = (await response.json()) as PlayerDataAPI;

  try {
    let player = await prisma.player.findUnique({
      where: { uuid: data.uid },
    });

    console.log("player", player);
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
    }

    const encodedData = encodeBuilds(data.avatarInfoList);
    const insertBuilds: Prisma.BuildCreateManyInput[] = encodedData.map(
      (avatar) => ({
        avatarId: avatar.avatarId,
        level: Number(avatar.level),
        ascension: Number(avatar.ascension),
        fetterLevel: Number(avatar.fetterlevel),
        constellation: avatar.constellations,
        fightProps: avatar.fightprops,
        skillLevel: avatar.skilllevel,
        plumeId: avatar.plume.itemId,
        plumeMainStat: avatar.plume.mainstat,
        plumeSubStats: avatar.plume.substats,
        plumeSubstatsId: avatar.plume.substatsidlist,
        flowerId: avatar.flower.itemId,
        flowerMainStat: avatar.flower.mainstat,
        flowerSubStats: avatar.flower.substats,
        flowerSubstatsId: avatar.flower.substatsidlist,
        sandsId: avatar.sands.itemId,
        sandsMainStat: avatar.sands.mainstat,
        sandsSubStats: avatar.sands.substats,
        sandsSubstatsId: avatar.sands.substatsidlist,
        gobletId: avatar.goblet.itemId,
        gobletMainStat: avatar.goblet.mainstat,
        gobletSubStats: avatar.goblet.substats,
        gobletSubstatsId: avatar.goblet.substatsidlist,
        circletId: avatar.circlet.itemId,
        circletMainStat: avatar.circlet.mainstat,
        circletSubStats: avatar.circlet.substats,
        circletSubstatsId: avatar.circlet.substatsidlist,
        weaponId: avatar.weapon.itemId,
        weaponLevel: avatar.weapon.level,
        weaponPromoteLevel: avatar.weapon.promoteLevel,
        weaponRefinement: avatar.weapon.refinement,
        weaponStat: avatar.weapon.stats,
        playerId: player!.id,
      })
    );

    const insertAvatars = await prisma.build.createMany({
      data: insertBuilds,
    });

    if (insertAvatars) {
      return res.status(200).json({ statusCode: 200, message: "ok" });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "ok",
    });
  } catch (error) {
    console.error("[api] user", error);
    return res.status(500).json({ statusCode: 500, message: "error" });
  }
}

function encodeBuilds(data: CharactersAPI[]) {
  return data.map((avatar) => {
    const equip = avatar.equipList
      .map((item) => {
        if (item.flat.itemType === "ITEM_WEAPON") {
          return {
            type: item.flat.itemType,
            itemId: item.itemId,
            level: item.weapon.level,
            promoteLevel: item.weapon.promoteLevel,
            refinement: Object.values(item.weapon.affixMap || { x: 0 })[0],
            stats: item.flat.weaponStats
              .map(
                (st: any) => `${STAT_NAMES[st.appendPropId]}|${st.statValue}`
              )
              .join(","),
          };
        }
        if (item.flat.itemType === "ITEM_RELIQUARY") {
          const substatsParsed = item.reliquary.appendPropIdList.reduce(
            (acc, id) => {
              const { type } = REAL_SUBSTAT_VALUES[id];
              const realStatName = STAT_NAMES[type];
              return {
                ...acc,
                [realStatName]: {
                  count: (acc[realStatName]?.count ?? 0) + 1,
                },
              };
            },
            {} as any
          );
          return {
            equipType: item.flat.equipType,
            type: item.flat.itemType,
            itemId: item.itemId,
            level: item.flat.rankLevel,
            mainstat: `${STAT_NAMES[item.flat.reliquaryMainstat.mainPropId]}|${
              item.flat.reliquaryMainstat.statValue
            }`,
            substats: item.flat.reliquarySubstats
              .map(
                (st: any) =>
                  `${STAT_NAMES[st.appendPropId]}|${st.statValue}/${
                    substatsParsed[STAT_NAMES[st.appendPropId]].count
                  }`
              )
              .join(","),
            substatsidlist: item.reliquary.appendPropIdList.join(","),
          };
        }
      })
      .reduce((acc, item: any) => {
        if (!item) return acc;
        if (item.equipType === "EQUIP_BRACER") {
          acc.flower = item;
        }
        if (item.equipType === "EQUIP_NECKLACE") {
          acc.plume = item;
        }
        if (item.equipType === "EQUIP_SHOES") {
          acc.sands = item;
        }
        if (item.equipType === "EQUIP_RING") {
          acc.goblet = item;
        }
        if (item.equipType === "EQUIP_DRESS") {
          acc.circlet = item;
        }
        if (!item.equipType) {
          acc.weapon = item;
        }
        return acc;
      }, {} as { flower: any; plume: any; sands: any; goblet: any; circlet: any; weapon: any });
    return {
      avatarId: avatar.avatarId,
      exp: avatar.propMap[1001]?.val ?? 0, // propMap.1001
      ascension: avatar.propMap[1002].val, // propMap.1002
      level: avatar.propMap[4001].val, // propMap.4001
      fightprops: Object.entries(avatar.fightPropMap)
        .map(([a, b]) => `${ENKA_NAMES[a] ? ENKA_NAMES[a] : a}|${b}`)
        .join(","),
      skilllevel: Object.entries(avatar.skillLevelMap)
        .map(([a, b]) => `${a}|${b}`)
        .join(","),
      fetterlevel: avatar.fetterInfo.expLevel,
      constellations: avatar?.talentIdList?.length ?? 0,
      ...equip,
    };
  });
}
