import { Build, Player } from "@prisma/client";
import { Artifact, Character, Weapon } from "genshin-data";

import { CharactersAPI } from "interfaces/enka";
import { ENKA_NAMES, REAL_SUBSTAT_VALUES, STAT_NAMES } from "./substats";

export async function encodeBuilds(data: CharactersAPI[]) {
  const artifactsDetail = await import(
    "../_content/genshin/data/artifacts_detail.json"
  );

  const getSetId = (artifactId: number) => {
    for (const value of artifactsDetail.default) {
      if (!value.ids) {
        continue;
      }
      if (value.ids.includes(artifactId.toString().slice(0, 4))) {
        return Number("2" + value.set);
      }
    }
    return 0;
  };

  return data.map((avatar) => {
    const equip = avatar.equipList
      .map((item) => {
        if (item.flat.itemType === "ITEM_WEAPON") {
          return {
            type: item.flat.itemType,
            itemId: item.itemId,
            level: item.weapon.level,
            promoteLevel: item.weapon.promoteLevel ?? 0,
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

          let critDmg = 0;
          let critRate = 0;
          const encodeSubstats = item.flat.reliquarySubstats
            .map((st: any) => {
              if (st.appendPropId === "FIGHT_PROP_CRITICAL") {
                critRate = st.statValue;
              } else if (st.appendPropId === "FIGHT_PROP_CRITICAL_HURT") {
                critDmg = st.statValue;
              }
              return `${STAT_NAMES[st.appendPropId]}|${st.statValue}/${
                substatsParsed[STAT_NAMES[st.appendPropId]].count
              }`;
            })
            .join(",");

          return {
            equipType: item.flat.equipType,
            type: item.flat.itemType,
            itemId: item.itemId,
            level: item.flat.rankLevel,
            mainstat: `${STAT_NAMES[item.flat.reliquaryMainstat.mainPropId]}|${
              item.flat.reliquaryMainstat.statValue
            }`,
            substats: encodeSubstats,
            critValue: (critDmg || 0) + (critRate || 0) * 2,
            substatsidlist: item.reliquary.appendPropIdList.join(","),
          };
        }
      })
      .reduce((acc, item: any) => {
        if (!item) return acc;
        if (item.equipType === "EQUIP_BRACER") {
          acc.flower = { ...item, setId: getSetId(item.itemId) };
        }
        if (item.equipType === "EQUIP_NECKLACE") {
          acc.plume = { ...item, setId: getSetId(item.itemId) };
        }
        if (item.equipType === "EQUIP_SHOES") {
          acc.sands = { ...item, setId: getSetId(item.itemId) };
        }
        if (item.equipType === "EQUIP_RING") {
          acc.goblet = { ...item, setId: getSetId(item.itemId) };
        }
        if (item.equipType === "EQUIP_DRESS") {
          acc.circlet = { ...item, setId: getSetId(item.itemId) };
        }
        if (!item.equipType) {
          acc.weapon = item;
        }
        return acc;
      }, {} as { flower: any; plume: any; sands: any; goblet: any; circlet: any; weapon: any });
    const encodedData = {
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

    const calculateCritValue = (
      equip: Record<string, any>,
      encodedData: any
    ) => {
      const CONSTELLATION_EXPONENT = 0.3;
      const WEAPON_REFINEMENT_EXPONENT = 0.2;
      const SKILL_LEVEL_EXPONENT = 0.1;

      const artifactCritValue = Object.values(equip).reduce(
        (acc, item: any) => acc + (item.critValue || 0),
        0
      );
      const constellationCritValue = Math.pow(
        encodedData.constellations,
        CONSTELLATION_EXPONENT
      );
      const weaponCritValue = Math.pow(
        encodedData.weapon.refinement,
        WEAPON_REFINEMENT_EXPONENT
      );
      const skillCritValue = Object.values(avatar.skillLevelMap).reduce(
        (acc, curr) => acc + Math.pow(curr, SKILL_LEVEL_EXPONENT),
        0
      );

      return (
        artifactCritValue +
        constellationCritValue +
        weaponCritValue +
        skillCritValue
      );
    };

    return {
      avatarId: encodedData.avatarId,
      level: Number(encodedData.level),
      ascension: Number(encodedData.ascension),
      fetterLevel: Number(encodedData.fetterlevel),
      constellation: encodedData.constellations,
      skillDepotId: avatar.skillDepotId,
      fightProps: encodedData.fightprops,
      skillLevel: encodedData.skilllevel,
      critValue: calculateCritValue(equip, encodedData),
      critValueArtifactsOnly: Object.values(equip).reduce(
        (acc, item: any) => acc + (item.critValue || 0),
        0
      ),
      plumeId: encodedData.plume?.itemId,
      plumeSetId: encodedData.plume?.setId,
      plumeMainStat: encodedData.plume?.mainstat,
      plumeSubStats: encodedData.plume?.substats,
      plumeSubstatsId: encodedData.plume?.substatsidlist,
      plumeCritValue: encodedData.plume?.critValue,
      flowerId: encodedData.flower?.itemId,
      flowerSetId: encodedData.flower?.setId,
      flowerMainStat: encodedData.flower?.mainstat,
      flowerSubStats: encodedData.flower?.substats,
      flowerSubstatsId: encodedData.flower?.substatsidlist,
      flowerCritValue: encodedData.flower?.critValue,
      sandsId: encodedData.sands?.itemId,
      sandsSetId: encodedData.sands?.setId,
      sandsMainStat: encodedData.sands?.mainstat,
      sandsSubStats: encodedData.sands?.substats,
      sandsSubstatsId: encodedData.sands?.substatsidlist,
      sandsCritValue: encodedData.sands?.critValue,
      gobletId: encodedData.goblet?.itemId,
      gobletSetId: encodedData.goblet?.setId,
      gobletMainStat: encodedData.goblet?.mainstat,
      gobletSubStats: encodedData.goblet?.substats,
      gobletSubstatsId: encodedData.goblet?.substatsidlist,
      gobletCritValue: encodedData.goblet?.critValue,
      circletId: encodedData.circlet?.itemId,
      circletSetId: encodedData.circlet?.setId,
      circletMainStat: encodedData.circlet?.mainstat,
      circletSubStats: encodedData.circlet?.substats,
      circletSubstatsId: encodedData.circlet?.substatsidlist,
      circletCritValue: encodedData.circlet?.critValue,
      weaponId: encodedData.weapon.itemId,
      weaponLevel: encodedData.weapon.level,
      weaponPromoteLevel: encodedData.weapon.promoteLevel,
      weaponRefinement: encodedData.weapon.refinement,
      weaponStat: encodedData.weapon.stats,
    };
  });
}

export async function decodeBuilds(
  data: (Build & {
    player?: Player;
  })[],
  characters: Character[],
  weapons: Weapon[],
  artifacts: Artifact[]
) {
  const decodeStr = (str: string | null): Record<string, number> =>
    str
      ? str.split(",").reduce((acc, stat) => {
          const [key, value] = stat.split("|");
          return {
            ...acc,
            [key]: Number(value),
          };
        }, {})
      : {};
  const decodeSubstatStr = (str: string | null): Record<string, number> =>
    str
      ? str.split(",").reduce((acc, stat) => {
          const [key, data] = stat.split("|");
          const [value, count] = data.split("/");
          return {
            ...acc,
            [key]: {
              value: Number(value),
              count: Number(count),
            },
          };
        }, {})
      : {};

  return data.map((build) => {
    let character = characters.find((c) => c._id === build.avatarId);

    // Handle traveler characters
    const travelerIds = [10000007, 10000005];

    if (travelerIds.includes(build.avatarId)) {
      character = characters.find(
        (c) => c.id === "traveler_" + getTravelerElement(build.skillDepotId)
      );
    }

    if (!character) {
      console.log("Character not found", build);
      return null;
    }

    const weapon = weapons.find((w) => w._id === build.weaponId);
    let flowerSet: Artifact | null = null;
    let plumeSet: Artifact | null = null;
    let sandsSet: Artifact | null = null;
    let gobletSet: Artifact | null = null;
    let circletSet: Artifact | null = null;

    if (build.flowerSetId) {
      flowerSet = artifacts.find((a) => a._id === build.flowerSetId)!;
    }

    if (build.plumeSetId) {
      plumeSet = artifacts.find((a) => a._id === build.plumeSetId)!;
    }

    if (build.sandsSetId) {
      sandsSet = artifacts.find((a) => a._id === build.sandsSetId)!;
    }

    if (build.gobletSetId) {
      gobletSet = artifacts.find((a) => a._id === build.gobletSetId)!;
    }

    if (build.circletSetId) {
      circletSet = artifacts.find((a) => a._id === build.circletSetId)!;
    }

    // remove duplicates and the ones that doesn't have 2 pieces or more
    const sets = [flowerSet, plumeSet, sandsSet, gobletSet, circletSet]
      .filter((value, index, self) => {
        // Remove nulls
        if (!value) {
          return false;
        }

        return (
          self.indexOf(value) === index &&
          self.filter((v) => v === value).length >= 2
        );
      })
      .map(
        (artifact) => artifacts.find((a) => a.id === artifact?.id) as Artifact
      );

    const stats = decodeStr(build.fightProps);
    const flowerSubstats = decodeSubstatStr(build.flowerSubStats);
    const plumeSubstats = decodeSubstatStr(build.plumeSubStats);
    const sandsSubstats = decodeSubstatStr(build.sandsSubStats);
    const gobletSubstats = decodeSubstatStr(build.gobletSubStats);
    const circletSubstats = decodeSubstatStr(build.circletSubStats);

    const flower = build.flowerId
      ? {
          flower: {
            artifactId: build.flowerId,
            id: flowerSet?.flower?.id ?? null,
            name: flowerSet?.flower?.name ?? null,
            rarity: flowerSet?.max_rarity ?? null,
            mainStat: decodeStr(build.flowerMainStat),
            subStats: flowerSubstats,
            subStatsIds: build.flowerSubstatsId,
            critValue: Number(build.flowerCritValue) ?? 0,
          },
        }
      : {};
    const plume = build.plumeId
      ? {
          plume: {
            artifactId: build.plumeId,
            id: plumeSet?.plume?.id ?? null,
            name: plumeSet?.plume?.name ?? null,
            rarity: plumeSet?.max_rarity ?? null,
            mainStat: decodeStr(build.plumeMainStat),
            subStats: plumeSubstats,
            subStatsIds: build.plumeSubstatsId,
            critValue: Number(build.plumeCritValue) ?? 0,
          },
        }
      : {};
    const sands = build.sandsId
      ? {
          sands: {
            artifactId: build.sandsId,
            id: sandsSet?.sands?.id ?? null,
            name: sandsSet?.sands?.name ?? null,
            rarity: sandsSet?.max_rarity ?? null,
            mainStat: decodeStr(build.sandsMainStat),
            subStats: sandsSubstats,
            subStatsIds: build.sandsSubstatsId,
            critValue: Number(build.sandsCritValue) ?? 0,
          },
        }
      : {};
    const goblet = build.gobletId
      ? {
          goblet: {
            artifactId: build.gobletId,
            id: gobletSet?.goblet?.id ?? null,
            name: gobletSet?.goblet?.name ?? null,
            rarity: gobletSet?.max_rarity ?? null,
            mainStat: decodeStr(build.gobletMainStat),
            subStats: gobletSubstats,
            subStatsIds: build.gobletSubstatsId,
            critValue: Number(build.gobletCritValue) ?? 0,
          },
        }
      : {};
    const circlet = build.circletId
      ? {
          circlet: {
            artifactId: build.circletId,
            id: circletSet?.circlet?.id ?? null,
            name: circletSet?.circlet?.name ?? null,
            rarity: circletSet?.max_rarity ?? null,
            mainStat: decodeStr(build.circletMainStat),
            subStats: circletSubstats,
            subStatsIds: build.circletSubstatsId,
            critValue: Number(build.circletCritValue) ?? 0,
          },
        }
      : {};
    const player = build.player
      ? {
          player: {
            uuid: build.player.uuid,
            nickname: build.player.nickname,
            region: regionParse(build.player?.uuid),
          },
        }
      : {};

    const skillLevel = decodeStr(build.skillLevel);

    return {
      _id: build.id,
      avatarId: build.avatarId,
      id: character.id,
      name: character.name,
      rarity: character.rarity,
      level: build.level,
      ascension: build.ascension,
      constellation: build.constellation,
      fetterLevel: build.fetterLevel,
      skillLevel,
      stats,
      critValue: Number(build.critValue) ?? 0,
      critValueArtifactsOnly: Number(build.critValueArtifactsOnly) ?? 0,
      ...flower,
      ...plume,
      ...sands,
      ...goblet,
      ...circlet,
      sets,
      weapon: {
        weaponId: build.weaponId,
        id: weapon?.id,
        name: weapon?.name,
        rarity: weapon?.rarity,
        level: build.weaponLevel,
        promoteLevel: build.weaponPromoteLevel,
        refinement: build.weaponRefinement,
        stat: decodeStr(build.weaponStat),
      },
      ...player,
    };
  });
}

/**
 * Parses a UUID and returns the corresponding region code.
 * @param uuid The UUID to parse.
 * @returns The region code as a string.
 */
export function regionParse(uuid: string) {
  const suffix = uuid[0];
  switch (suffix) {
    case "0":
      return "Internal";
    case "1":
    case "2":
      return "CN";
    case "5":
      return "B";
    case "6":
      return "NA";
    case "7":
      return "EU";
    case "8":
      return "ASIA";
    case "9":
      return "TW";
    default:
      return "Unknown";
  }
}

/**
 * Returns the corresponding element for a given skill depot ID.
 * @param skillDepotId The ID of the skill depot.
 * @returns The corresponding element as a string.
 */
function getTravelerElement(skillDepotId: number) {
  const pyro = [502, 702];
  const hydro = [503, 703];
  const anemo = [504, 704];
  const cryo = [505, 705];
  const geo = [506, 706];
  const electro = [507, 707];
  const dendro = [508, 708];

  if (pyro.includes(skillDepotId)) {
    return "pyro";
  }
  if (hydro.includes(skillDepotId)) {
    return "hydro";
  }
  if (cryo.includes(skillDepotId)) {
    return "cryo";
  }
  if (pyro.includes(skillDepotId)) {
    return "pyro";
  }
  if (anemo.includes(skillDepotId)) {
    return "anemo";
  }
  if (geo.includes(skillDepotId)) {
    return "geo";
  }
  if (electro.includes(skillDepotId)) {
    return "electro";
  }
  if (dendro.includes(skillDepotId)) {
    return "dendro";
  }

  return "anemo";
}
