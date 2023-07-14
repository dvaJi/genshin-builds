import { HSRBuild, HSRPlayer } from "@prisma/client";
import { Character, LightCone, Relic } from "hsr-data";

import {
  Addition,
  Character as CharactersAPI,
  Relic as RelicAPI,
  Skill,
} from "interfaces/mihomo";

export async function encodeBuilds(
  data: CharactersAPI[]
): Promise<Omit<HSRBuild[], "playerId">> {
  const encSkills = (skills: Skill[]) =>
    skills.reduce((acc, skill) => {
      return `${acc}${skill.id}|${skill.level},`;
    }, "");

  const encRelics = (relics: RelicAPI[]) =>
    relics.reduce((acc, relic) => {
      const gearName = relicIdToType(relic.id);
      acc[gearName] = {
        [`${gearName}RelicId`]: Number(relic.id),
        [`${gearName}RelicSetId`]: Number(relic.set_id),
        [`${gearName}RelicLevel`]: Number(relic.level),
        [`${gearName}RelicRarity`]: Number(relic.rarity),
        [`${gearName}MainStat`]: `${relic.main_affix.field}${
          relic.main_affix.percent ? "_percent" : ""
        }|${relic.main_affix.value}`,
        [`${gearName}SubStats`]: relic.sub_affix
          .map(
            (stat) =>
              `${stat.field}${stat.percent ? "_percent" : ""}|${stat.value}/${
                stat.count ?? 0
              }_${stat.step ?? 0}`
          )
          .join(","),
        [`${gearName}CritValue`]: 0,
      };
      return acc;
    }, {} as Record<string, any>);

  const encStats = (attrs: Addition[]) => {
    return attrs
      .map(
        (attr) => `${attr.field}${attr.percent ? "_percent" : ""}|${attr.value}`
      )
      .join(",");
  };

  return data.map((avatar) => {
    const encodedRelics = encRelics(avatar.relics);
    return {
      avatarId: Number(avatar.id),
      level: avatar.level,
      promotion: avatar.promotion,
      rank: avatar.rank,
      skillLevel: encSkills(avatar.skills),

      attributes: encStats(avatar.attributes),
      additions: encStats(avatar.additions),
      properties: encStats(avatar.properties),

      lightConeId: Number(avatar.light_cone.id),
      lightConeLevel: avatar.light_cone.level,
      lightConePromotion: avatar.light_cone.promotion,
      lightConeRank: avatar.light_cone.rank,

      ...encodedRelics.head,
      ...encodedRelics.hands,
      ...encodedRelics.body,
      ...encodedRelics.feet,
      ...encodedRelics.planarSphere,
      ...encodedRelics.linkRope,
    };
  });
}

export async function decodeBuilds(
  data: (HSRBuild & {
    player?: HSRPlayer;
  })[],
  characters: Character[],
  lightCones: LightCone[],
  relics: Relic[]
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
          const [value, anotherdata] = data.split("/");
          const [count, steps] = anotherdata.split("_");
          return {
            ...acc,
            [key]: {
              value: Number(value),
              count: Number(count),
              steps: Number(steps),
            },
          };
        }, {})
      : {};

  return data.map((build) => {
    let character = characters.find((c) => c._id === build.avatarId);

    if (!character) {
      console.log("Character not found", build);
      return null;
    }

    const lightCone = lightCones.find((w) => w._id === build.lightConeId);
    const buildRelics: any[] = [];
    const relicsSets: Relic[] = [];

    const addRelic = (build: any, pieceName: string) => {
      const setId = build[`${pieceName}RelicSetId`];
      const id = build[`${pieceName}RelicId`];
      if (setId && id) {
        const set = relics.find((a) => a._id === setId)!;
        relicsSets.push(set);

        const piece = set.pieces.find(
          (a) => a._id.toString().slice(1) === id.toString().slice(1)
        );
        // console.log("piece", relicIdToType(id.toString()), setId, typeof piece, id.toString(), set.pieces.map((a) => ({id: a._id, nam: a.name})))
        const rarity = build[`${pieceName}RelicRarity`];
        const level = build[`${pieceName}RelicLevel`];
        const mainStat = decodeStr(build[`${pieceName}MainStat`]);
        const subStats = decodeSubstatStr(build[`${pieceName}SubStats`]);
        buildRelics.push({
          _id: id,
          id: piece?.id ?? null,
          setId,
          type: relicIdToType(id.toString()),
          name: piece?.name ?? null,
          rarity,
          level,
          // rarity: buildRelics?.head?.rarity ?? null,
          mainStat,
          subStats,
          critValue: 0,
        });
      }
    };

    addRelic(build, "head");
    addRelic(build, "hands");
    addRelic(build, "body");
    addRelic(build, "feet");
    addRelic(build, "planarSphere");
    addRelic(build, "linkRope");

    // remove duplicates and add the amount of duplicates to the set
    const sets = relicsSets.reduce(
      (acc, relic) => ({
        ...acc,
        [relic.id]: {
          _id: relic._id,
          id: relic.id,
          name: relic.name,
          effects: relic.effects,
          count: relicsSets.filter((r) => r.id === relic.id).length,
        },
      }),
      {}
    );

    // const stats = decodeStr(build.fightProps);

    const player = build.player
      ? {
          uuid: build.player.uuid,
          nickname: build.player.nickname,
          region: regionParse(build.player?.uuid),
        }
      : null;

    const skillLevel = decodeStr(build.skillLevel);

    const ranks = character.eidolons.map((eidolon, i) => {
      // build.rank is the current rank of the character
      const isUnlocked = i < build.rank;
      return { ...eidolon, isUnlocked };
    });

    const skills = character.skills.map((skill) => {
      const level = skillLevel[skill._id] ?? 0;
      return { ...skill, level };
    });

    return {
      _id: build.id,
      avatarId: build.avatarId,
      id: character.id,
      name: character.name,
      rarity: character.rarity,
      level: build.level,
      promotion: build.promotion,
      rank: build.rank,
      ranks,
      skillLevel,
      skills,
      combat_type: character.combat_type,
      path: character.path,
      faction: character.faction,
      
      attributes: decodeStr(build.attributes),
      additions: decodeStr(build.additions),
      properties: decodeStr(build.properties),

      critValue: Number(build.critValue) ?? 0,
      critValueArtifactsOnly: Number(build.critValueArtifactsOnly) ?? 0,
      lightCone: {
        weaponId: build.lightConeId,
        id: lightCone?.id,
        name: lightCone?.name,
        rarity: lightCone?.rarity,
        level: build.lightConeLevel,
        promotion: build.lightConePromotion,
        rank: build.lightConeRank,
      },
      relics: buildRelics,
      sets,
      ...player,
    };
  });
}

/**
 * Parses a relic ID and returns the corresponding relic type.
 * @param id relic id, eg: "41052"
 * @returns relic type as a string, eg: "head"
 */
export function relicIdToType(id: string) {
  // last digit of the id is the type, if 1 then it's a head relic
  switch (id.slice(-1)) {
    case "1":
      return "head";
    case "2":
      return "hands";
    case "3":
      return "body";
    case "4":
      return "feet";
    case "5":
      return "planarSphere";
    case "6":
      return "linkRope";
    default:
      return "Unknown";
  }
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
