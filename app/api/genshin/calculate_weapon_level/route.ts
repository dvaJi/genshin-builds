import { CalculationItemResult } from "interfaces/calculator";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import type { ExpMaterial, Weapon } from "@interfaces/genshin";
import { getGenshinData } from "@lib/dataApi";

const lvlexp = [
  [
    0, 275, 700, 1300, 2100, 3125, 4400, 5950, 7800, 9975, 12475, 15350, 18600,
    22250, 26300, 30800, 35750, 41150, 47050, 53475, 60400, 68250, 76675, 85725,
    95400, 105725, 116700, 128350, 140700, 153750, 167550, 182075, 197375,
    213475, 230375, 248075, 266625, 286025, 306300, 327475, 349525, 373675,
    398800, 424925, 452075, 480275, 509525, 539850, 571275, 603825, 637475,
    674025, 711800, 750800, 791075, 832625, 875475, 919625, 965125, 1011975,
    1060200, 1112275, 1165825, 1220875, 1277425, 1335525, 1395175, 1456400,
    1519200, 1583600, 1649625, 1720700, 1793525, 1868100, 1944450, 2022600,
    2102600, 2184450, 2268150, 2353725, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3988200,
  ],
  [
    0, 400, 1025, 1925, 3125, 4675, 6625, 8975, 11775, 15075, 18875, 23225,
    28150, 33675, 39825, 46625, 54125, 62325, 71275, 81000, 91500, 103400,
    116175, 129875, 144525, 160150, 176775, 194425, 213125, 232900, 253800,
    275825, 299025, 323400, 349000, 375825, 403925, 433325, 464050, 496125,
    529550, 566125, 604200, 643800, 684950, 727675, 772000, 817950, 865550,
    914850, 965850, 1021225, 1078450, 1137550, 1198575, 1261525, 1326450,
    1393350, 1462275, 1533250, 1606300, 1685200, 1766325, 1849725, 1935425,
    2023450, 2113825, 2206575, 2301725, 2399300, 2499350, 2607025, 2717350,
    2830350, 2946050, 3064475, 3185675, 3309675, 3436500, 3566175, 3698750,
    3855225, 4031100, 4228700, 4450675, 4699975, 4979925, 5294175, 5646875,
    6042650,
  ],
  [
    0, 600, 1550, 2900, 4700, 7025, 9950, 13475, 17675, 22625, 28325, 34850,
    42250, 50550, 59775, 69975, 81225, 93525, 106950, 121550, 137300, 155150,
    174325, 194875, 216850, 240300, 265250, 291725, 319775, 349450, 380800,
    413850, 448650, 485225, 523625, 563875, 606025, 650125, 696225, 744350,
    794500, 849375, 906500, 965900, 1027625, 1091725, 1158225, 1227150, 1298550,
    1372500, 1449000, 1532075, 1617925, 1706575, 1798125, 1892550, 1989950,
    2090300, 2193700, 2300175, 2409750, 2528100, 2649800, 2774900, 2903450,
    3035500, 3171075, 3310200, 3452925, 3599300, 3749375, 3910900, 4076400,
    4245900, 4419450, 4597100, 4778900, 4964900, 5155150, 5349675, 5548550,
    5783275, 6047100, 6343500, 6676475, 7050425, 7470350, 7941725, 8470775,
    9064450,
  ],
];

const schema = z.object({
  weaponId: z.string(),
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

  const weapon = await getGenshinData<Weapon>({
    resource: "weapons",
    language: request.data.lang,
    filter: {
      id: request.data.weaponId,
    },
  });

  if (!weapon) {
    return NextResponse.json(
      { error: "Weapon not found" },
      {
        status: 404,
      },
    );
  }

  const weaponexpMaterial = (
    await getGenshinData<ExpMaterial[]>({
      resource: "weaponExpMaterials",
      language: request.data.lang,
    })
  ).sort((a, b) => b.rarity - a.rarity);

  let current = 0;
  let moraNeeded = 0;
  let items: CalculationItemResult[] = [];
  const sortMap: Record<string, number> = {};

  const setSortMap = (key: string, amount: number) => {
    sortMap[key] = amount;
  };

  const params = request.data.params;

  // Calculate EXP
  if (params.intendedLevel.lvl >= params.currentLevel.lvl) {
    let target =
      lvlexp[weapon.rarity - 3][params.intendedLevel.lvl - 1] -
      (lvlexp[weapon.rarity - 3][params.currentLevel.lvl - 1] + 0);
    current = target;
    moraNeeded = Math.ceil(target / 10 / 20) * 20;

    for (const expItem of weaponexpMaterial) {
      if (expItem.id == "enhancement_ore") {
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

  setSortMap("enhancement_ore", 1);
  setSortMap("fine_enhancement_ore", 2);
  setSortMap("mystic_enhancement_ore", 3);

  const itemsMap: Record<string, CalculationItemResult> = {};
  const talentsMaterialFolder = [
    "weapon_primary_materials",
    "weapon_secondary_materials",
    "common_materials",
    "weapon_primary_materials",
  ];

  // Calculate materials for talents
  for (const ascension of weapon.ascensions) {
    if (
      params.currentLevel.asclLvl <= ascension.ascension &&
      ascension.ascension <= params.intendedLevel.asclLvl
    ) {
      if (!ascension.cost) {
        continue;
      }

      moraNeeded += ascension.cost;

      for (let index = 0; index < ascension.materials.length; index++) {
        const item = ascension.materials[index];
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

  return NextResponse.json(items);
}
