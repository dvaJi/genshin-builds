import { IMGS_CDN } from "@lib/constants";
import {
  calculateTotalAscensionMaterials,
  calculateTotalTalentMaterials,
} from "@utils/character";
import clsx from "clsx";
import { Character } from "genshin-data";
import { useState } from "react";
import Button from "./Button";

type Props = {
  characters: Character[];
  lvlExp: number[];
};

type Result = {
  id: string;
  img: string;
  name: string;
  amount: number;
};

type Level = {
  lvl: number;
  asc: boolean;
  asclLvl: number;
};

const charExpMaterial = [
  {
    id: "heros_wit",
    img: `${IMGS_CDN}/heros_wit.png`,
    name: "Hero's Wit",
    value: 20000,
  },
  {
    id: "adventurers_experience",
    img: `${IMGS_CDN}/adventurers_experience.png`,
    name: "Adventurer's Experience",
    value: 5000,
  },
  {
    id: "wanderers_advice",
    img: `${IMGS_CDN}/wanderers_advice.png`,
    name: "Wanderer's Advice",
    value: 1000,
  },
];

const levels: Level[] = [
  {
    lvl: 1,
    asc: false,
    asclLvl: 0,
  },
  {
    lvl: 20,
    asc: false,
    asclLvl: 0,
  },
  {
    lvl: 20,
    asc: true,
    asclLvl: 1,
  },
  {
    lvl: 40,
    asc: false,
    asclLvl: 1,
  },
  {
    lvl: 40,
    asc: true,
    asclLvl: 2,
  },
  {
    lvl: 50,
    asc: false,
    asclLvl: 2,
  },
  {
    lvl: 50,
    asc: true,
    asclLvl: 3,
  },
  {
    lvl: 60,
    asc: false,
    asclLvl: 3,
  },
  {
    lvl: 60,
    asc: true,
    asclLvl: 4,
  },
  {
    lvl: 70,
    asc: false,
    asclLvl: 4,
  },
  {
    lvl: 70,
    asc: true,
    asclLvl: 5,
  },
  {
    lvl: 80,
    asc: false,
    asclLvl: 5,
  },
  {
    lvl: 80,
    asc: true,
    asclLvl: 6,
  },
  {
    lvl: 90,
    asc: false,
    asclLvl: 6,
  },
];

const CharacterCalculator = ({ characters, lvlExp }: Props) => {
  const [result, setResult] = useState<Result[]>([]);
  const [character, setCharacter] = useState<Character>(characters[0]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[0]);
  const [currentTalent1Lvl, setCurrentTalent1Lvl] = useState(1);
  const [currentTalent2Lvl, setCurrentTalent2Lvl] = useState(1);
  const [currentTalent3Lvl, setCurrentTalent3Lvl] = useState(1);
  const [intendedTalent1Lvl, setIntendedTalent1Lvl] = useState(1);
  const [intendedTalent2Lvl, setIntendedTalent2Lvl] = useState(1);
  const [intendedTalent3Lvl, setIntendedTalent3Lvl] = useState(1);

  const calculate = () => {
    setResult([]);

    let current = 0;
    let moraNeeded = 0;
    let newresult: Result[] = [];

    // Calculate EXP
    if (intendedLevel.lvl > currentLevel.lvl) {
      const target =
        lvlExp[intendedLevel.lvl - 1] - (lvlExp[currentLevel.lvl - 1] + 0);
      current = target;
      moraNeeded = (Math.floor(target / 1000) * 1000) / 5;

      for (const expItem of charExpMaterial) {
        if (charExpMaterial[2].id === expItem.id) {
          const amount = Math.ceil(current / expItem.value);
          newresult.push({
            id: expItem.id,
            img: expItem.img,
            name: expItem.name,
            amount,
          });
          current = target - Math.ceil(target / expItem.value) * expItem.value;
        } else if (current > 0) {
          const amount = Math.round(current / expItem.value);
          newresult.push({
            id: expItem.id,
            img: expItem.img,
            name: expItem.name,
            amount,
          });
          current = target - Math.floor(target / expItem.value) * expItem.value;
        }
      }
    }

    // Calculate Ascension materials
    if (character) {
      if (currentLevel.asclLvl < intendedLevel.asclLvl) {
        const { cost, items } = calculateTotalAscensionMaterials(
          character.ascension,
          currentLevel.asclLvl,
          intendedLevel.asclLvl
        );

        moraNeeded += cost;

        items.forEach((item) => {
          newresult.push({
            id: item.id,
            img: `${IMGS_CDN}/${item.type}/${item.id}.png`,
            name: item.name,
            amount: item.amount,
          });
        });
      }

      if (intendedTalent1Lvl > currentTalent1Lvl) {
        const totalTalentMaterials = calculateTotalTalentMaterials(
          character.talent_materials,
          currentTalent1Lvl,
          intendedTalent1Lvl
        );

        moraNeeded += totalTalentMaterials.cost;
        totalTalentMaterials.items.forEach((item) => {
          newresult.push({
            id: item.id,
            img: `${IMGS_CDN}/${item.type}/${item.id}.png`,
            name: item.name,
            amount: item.amount,
          });
        });
      }

      if (intendedTalent2Lvl > currentTalent2Lvl) {
        const totalTalentMaterials = calculateTotalTalentMaterials(
          character.talent_materials,
          currentTalent2Lvl,
          intendedTalent2Lvl
        );

        moraNeeded += totalTalentMaterials.cost;
        totalTalentMaterials.items.forEach((item) => {
          newresult.push({
            id: item.id,
            img: `${IMGS_CDN}/${item.type}/${item.id}.png`,
            name: item.name,
            amount: item.amount,
          });
        });
      }

      if (intendedTalent3Lvl > currentTalent3Lvl) {
        const totalTalentMaterials = calculateTotalTalentMaterials(
          character.talent_materials,
          currentTalent3Lvl,
          intendedTalent3Lvl
        );

        moraNeeded += totalTalentMaterials.cost;
        totalTalentMaterials.items.forEach((item) => {
          newresult.push({
            id: item.id,
            img: `${IMGS_CDN}/${item.type}/${item.id}.png`,
            name: item.name,
            amount: item.amount,
          });
        });
      }
    }

    // Sum all items
    newresult = newresult.reduce<Result[]>((acc, cur) => {
      const existing = acc.find((item) => item.id === cur.id);
      console.log(existing, acc);
      if (existing) {
        console.log(cur.id, existing.amount, cur.amount);
        acc[acc.findIndex((item) => item.id === cur.id)] = {
          ...existing,
          amount: existing.amount + cur.amount,
        };
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);

    newresult.push({
      id: "mora",
      img: `${IMGS_CDN}/materials/mora.png`,
      name: "Mora",
      amount: moraNeeded,
    });

    // if (current < 0) {
    //   newresult.push({
    //     id: "exp",
    //     img: `${IMGS_CDN}/materials/mora.png`,
    //     name: "Exp Wasted",
    //     amount: current,
    //   });
    // }

    setResult(newresult);
  };

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <div>Calculate Ascnesion materials?</div>
        <div>
          <select
            onChange={(e) => setCharacter(characters[Number(e.target.value)])}
          >
            {characters.map((character, i) => (
              <option key={character.id} value={i}>
                {character.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span>Current character Level, Exp, and ascension</span>
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className="m-1"
                onClick={() => setCurrentLevel(level)}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center font-semibold rounded-full w-10 h-10 leading-none flex-col",
                    level.lvl === currentLevel.lvl &&
                      level.asclLvl === currentLevel.asclLvl
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  )}
                >
                  <div className="">{level.lvl}</div>
                  <img
                    src={`${IMGS_CDN}/ascension.png`}
                    className={clsx("w-4 opacity-25", {
                      "opacity-100": level.asc,
                    })}
                    alt="ascension"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <span>Expected level</span>
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className="m-1"
                onClick={() => setIntendedLevel(level)}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center font-semibold rounded-full w-10 h-10 leading-none flex-col",
                    level.lvl === intendedLevel.lvl &&
                      level.asclLvl === intendedLevel.asclLvl
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  )}
                >
                  <div className="">{level.lvl}</div>
                  <img
                    src={`${IMGS_CDN}/ascension.png`}
                    className={clsx("w-4 opacity-25", {
                      "opacity-100": level.asc,
                    })}
                    alt="ascension"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div>Calculate talent ascension materials</div>
        <div className="grid grid-cols-3">
          <div>Auto Attack</div>
          <div>Skill</div>
          <div>Burst</div>
        </div>
        <div className="grid grid-cols-3">
          <input
            type="number"
            value={currentTalent1Lvl}
            onChange={(e) => setCurrentTalent1Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <input
            type="number"
            value={currentTalent2Lvl}
            onChange={(e) => setCurrentTalent2Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <input
            type="number"
            value={currentTalent3Lvl}
            onChange={(e) => setCurrentTalent3Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div className="grid grid-cols-3">
          <input
            type="number"
            value={intendedTalent1Lvl}
            onChange={(e) => setIntendedTalent1Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <input
            type="number"
            value={intendedTalent2Lvl}
            onChange={(e) => setIntendedTalent2Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <input
            type="number"
            value={intendedTalent3Lvl}
            onChange={(e) => setIntendedTalent3Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
      <div>
        <div>
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div>
          <div className="bg-vulcan-900 rounded-xl p-4 mt-2 block md:inline-block">
            <table>
              {result.map((res) => (
                <tr key={res.name}>
                  <td className="text-right border-b border-gray-700 py-1">
                    <span className="text-white mr-2 whitespace-no-wrap">
                      {numFormat.format(res.amount)} X
                    </span>
                  </td>
                  <td className="border-b border-gray-700 py-1">
                    <span className="text-white">
                      <span className="w-6 inline-block">
                        <img
                          className="h-6 inline-block mr-1"
                          src={res.img}
                          alt={res.name}
                        />
                      </span>
                      {res.name}
                    </span>
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCalculator;
