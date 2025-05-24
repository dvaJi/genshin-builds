import { CalculationItemResult } from "interfaces/calculator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import type { Character, ExpMaterial } from "@interfaces/genshin";
import { getGenshinData } from "@lib/dataApi";

const lvlExpList = [
  0, 1000, 2325, 4025, 6175, 8800, 11950, 15675, 20025, 25025, 30725, 37175,
  44400, 52450, 61375, 71200, 81950, 93675, 106400, 120175, 135050, 151850,
  169850, 189100, 209650, 231525, 254775, 279425, 305525, 333100, 362200,
  392850, 425100, 458975, 494525, 531775, 570750, 611500, 654075, 698500,
  744800, 795425, 848125, 902900, 959800, 1018875, 1080150, 1143675, 1209475,
  1277600, 1348075, 1424575, 1503625, 1585275, 1669550, 1756500, 1846150,
  1938550, 2033725, 2131725, 2232600, 2341550, 2453600, 2568775, 2687100,
  2808625, 2933400, 3061475, 3192875, 3327650, 3465825, 3614525, 3766900,
  3922975, 4082800, 4246400, 4413825, 4585125, 4760350, 4939525, 5122700,
  5338925, 5581950, 5855050, 6161850, 6506450, 6893400, 7327825, 7815450,
  8362650,
];

const schema = z.object({
  characterId: z.string(),
  lang: z.string(),
  params: z.object({
    currentLevel: z.object({
      lvl: z.number().min(1).max(90),
      asc: z.boolean(),
      asclLvl: z.number(),
    }),
    intendedLevel: z.object({
      lvl: z.number().min(1).max(90),
      asc: z.boolean(),
      asclLvl: z.number(),
    }),
    currentTalentLvl: z.object({
      aa: z.number().min(1).max(10),
      skill: z.number().min(1).max(10),
      burst: z.number().min(1).max(10),
    }),
    intendedTalentLvl: z.object({
      aa: z.number().min(1).max(10),
      skill: z.number().min(1).max(10),
      burst: z.number().min(1).max(10),
    }),
  }),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const request = schema.safeParse(body);

  if (!request.success) {
    return NextResponse.json(
      { error: request.error },
      {
        status: 400,
      },
    );
  }

  const character = await getGenshinData<Character>({
    resource: "characters",
    language: request.data.lang,
    filter: {
      id: request.data.characterId,
    },
  });

  if (!character) {
    return NextResponse.json(
      { error: "Character not found" },
      {
        status: 404,
      },
    );
  }

  const charExpMaterial = (
    await getGenshinData<ExpMaterial[]>({
      resource: "characterExpMaterials",
      language: request.data.lang,
    })
  ).sort((a, b) => b.rarity - a.rarity);

  let current = 0;
  let moraNeeded = 0;
  let items: CalculationItemResult[] = [];
  let sortMap: Record<string, number> = {};

  const setSortMap = (key: string, amount: number) => {
    sortMap[key] = amount;
  };

  const params = request.data.params;

  if (params.intendedLevel.lvl > params.currentLevel.lvl) {
    const minIndex = params.intendedLevel.lvl - 1;
    const maxIndex = params.currentLevel.lvl - 1;
    let target = lvlExpList[minIndex] - (lvlExpList[maxIndex] + 0);
    current = target;
    const lvlCost = 1000;
    moraNeeded = (Math.floor(target / lvlCost) * lvlCost) / 5;

    // calculate exp materials
    for (const expItem of charExpMaterial) {
      if (expItem.id == "wanderers_advice") {
        const amount = Math.ceil(current / expItem.exp);

        items.push({
          id: expItem.id,
          name: expItem.name,
          img: "/materials/" + expItem.id + ".png",
          amount: amount,
          rarity: expItem.rarity,
        });

        current = target - Math.ceil(target / expItem.exp) * expItem.exp;
      } else if (current > 0 && Math.floor(current / expItem.exp) > 0) {
        const amount = Math.floor(current / expItem.exp);
        items.push({
          id: expItem.id,
          name: expItem.name,
          img: "/materials/" + expItem.id + ".png",
          amount: amount,
          rarity: expItem.rarity,
        });

        current = target - Math.floor(target / expItem.exp) * expItem.exp;
      }
    }
  }

  setSortMap("heros_wit", 1);
  setSortMap("adventurers_experience", 2);
  setSortMap("wanderers_advice", 3);

  const itemsMap: Record<string, CalculationItemResult> = {};

  // Calculate Ascension materials
  if (params.currentLevel.asclLvl < params.intendedLevel.asclLvl) {
    for (let index = 1; index < character.ascension.length; index++) {
      const item = character.ascension[index];
      if (
        index - 1 <= params.currentLevel.asclLvl ||
        index - 1 > params.intendedLevel.asclLvl
      ) {
        continue;
      }

      moraNeeded += item.cost ?? 0;
      // Mat one
      if (item.mat1) {
        if (!itemsMap[item.mat1.id]) {
          itemsMap[item.mat1.id] = {
            id: item.mat1.id,
            name: item.mat1.name,
            img: "/materials/" + item.mat1.id + ".png",
            amount: item.mat1.amount,
            rarity: item.mat1.rarity,
          };
          setSortMap(item.mat1.id, 100 + item.mat1.rarity);
        } else {
          itemsMap[item.mat1.id].amount += item.mat1.amount;
        }
      }

      // Mat two
      if (item.mat2) {
        if (!itemsMap[item.mat2.id]) {
          itemsMap[item.mat2.id] = {
            id: item.mat2.id,
            name: item.mat2.name,
            img: "/materials/" + item.mat2.id + ".png",
            amount: item.mat2.amount,
            rarity: item.mat2.rarity,
          };
          setSortMap(item.mat2.id, 200 + item.mat2.rarity);
        } else {
          itemsMap[item.mat2.id].amount += item.mat2.amount;
        }
      }

      // Mat three
      if (item.mat3) {
        if (!itemsMap[item.mat3.id]) {
          itemsMap[item.mat3.id] = {
            id: item.mat3.id,
            name: item.mat3.name,
            img: "/materials/" + item.mat3.id + ".png",
            amount: item.mat3.amount,
            rarity: item.mat3.rarity,
          };
          setSortMap(item.mat3.id, 300 + item.mat3.rarity);
        } else {
          itemsMap[item.mat3.id].amount += item.mat3.amount;
        }
      }

      // Mat four
      if (item.mat4) {
        if (!itemsMap[item.mat4.id]) {
          itemsMap[item.mat4.id] = {
            id: item.mat4.id,
            name: item.mat4.name,
            img: "/materials/" + item.mat4.id + ".png",
            amount: item.mat4.amount,
            rarity: item.mat4.rarity,
          };
          setSortMap(item.mat4.id, 400 + item.mat4.rarity);
        } else {
          itemsMap[item.mat4.id].amount += item.mat4.amount;
        }
      }
    }
  }

  const talentsMaterialFolder = [
    "talent_lvl_up_materials",
    "common_materials",
    "talent_lvl_up_materials",
    "talent_lvl_up_materials",
  ];

  // Calculate materials for talents
  const calculateTalentMaterials = (levelMin: number, levelMax: number) => {
    for (const talent of character.talent_materials) {
      if (levelMin < talent.level && talent.level <= levelMax) {
        moraNeeded += talent.cost;

        for (let index = 0; index < talent.items.length; index++) {
          const item = talent.items[index];
          const currentFolder = talentsMaterialFolder[index];
          if (!itemsMap[item.id]) {
            itemsMap[item.id] = {
              id: item.id,
              name: item.name,
              img: "/" + currentFolder + "/" + item.id + ".png",
              amount: item.amount,
              rarity: item.rarity,
            };
            setSortMap(item.id, (index + 1) * 1000 + item.rarity);
          } else {
            itemsMap[item.id].amount += item.amount;
          }
        }
      }
    }
  };

  // Auto attack
  if (params.currentTalentLvl.aa < params.intendedTalentLvl.aa) {
    calculateTalentMaterials(
      params.currentTalentLvl.aa,
      params.intendedTalentLvl.aa,
    );
  }

  // Skill
  if (params.currentTalentLvl.skill < params.intendedTalentLvl.skill) {
    calculateTalentMaterials(
      params.currentTalentLvl.skill,
      params.intendedTalentLvl.skill,
    );
  }

  // Burst
  if (params.currentTalentLvl.burst < params.intendedTalentLvl.burst) {
    calculateTalentMaterials(
      params.currentTalentLvl.burst,
      params.intendedTalentLvl.burst,
    );
  }

  // append ItemsMap to items
  for (const key in itemsMap) {
    if (Object.prototype.hasOwnProperty.call(itemsMap, key)) {
      const item = itemsMap[key];
      items.push(item);
    }
  }

  // sort items
  items = items.sort((i, j) => sortMap[i.id] - sortMap[j.id]);

  if (moraNeeded > 0) {
    items.push({
      id: "mora",
      name: "Mora",
      img: `/materials/mora.png`,
      amount: moraNeeded,
      rarity: 1,
    });
  }

  return NextResponse.json({ expWasted: current, items });
}
