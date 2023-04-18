import type { NextApiRequest, NextApiResponse } from "next";
import GenshinData from "genshin-data";
import {
  CalculationParam,
  CalculationCharacterResult,
  CalculationItemResult,
} from "interfaces/calculator";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CalculationCharacterResult | null>
) {
  console.log(req.body);
  const { characterId, lang, params } = req.body as {
    characterId: string;
    lang: string;
    params: CalculationParam;
  };
  const gi = new GenshinData({ language: lang as any });
  const character = (await gi.characters()).find((c) => c.id === characterId);

  if (!character) {
    res.status(404).json(null);
    return;
  }

  const charExpMaterial = (await gi.characterExpMaterials()).sort(
    (a, b) => b.rarity - a.rarity
  );

  let current = 0;
  let moraNeeded = 0;
  let items: CalculationItemResult[] = [];
  let sortMap: Record<string, number> = {};

  const setSortMap = (key: string, amount: number) => {
    sortMap[key] = amount;
  };

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
    for (const [index, item] of character.ascension.entries()) {
      if (
        index === 0 ||
        index <= params.currentLevel.asclLvl ||
        index > params.intendedLevel.asclLvl
      ) {
        continue;
      }

      moraNeeded += item.cost;
      // Mat one
      if (item.mat1) {
        if (!itemsMap[item.mat1.id]) {
          itemsMap[item.mat1.id] = {
            id: item.mat1.id,
            name: item.mat1.name,
            img: "/jewels_materials/" + item.mat1.id + ".png",
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
            img: "/elemental_stone_materials/" + item.mat2.id + ".png",
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
            img: "/local_materials/" + item.mat3.id + ".png",
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
            img: "/common_materials/" + item.mat4.id + ".png",
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
      params.intendedTalentLvl.aa
    );
  }

  // Skill
  if (params.currentTalentLvl.skill < params.intendedTalentLvl.skill) {
    calculateTalentMaterials(
      params.currentTalentLvl.skill,
      params.intendedTalentLvl.skill
    );
  }

  // Burst
  if (params.currentTalentLvl.burst < params.intendedTalentLvl.burst) {
    calculateTalentMaterials(
      params.currentTalentLvl.burst,
      params.intendedTalentLvl.burst
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

  const expWasted = current;

  res.status(200).json({ expWasted, items });
}
