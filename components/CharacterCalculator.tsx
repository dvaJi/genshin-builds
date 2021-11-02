import { useMemo, useState } from "react";
import clsx from "clsx";
import { Character } from "genshin-data";

import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

import { getUrl } from "@lib/imgUrl";
import {
  calculateTotalAscensionMaterials,
  calculateTotalTalentMaterials,
  levels,
} from "@utils/totals";

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
    img: `/materials/heros_wit.png`,
    name: "Hero's Wit",
    value: 20000,
  },
  {
    id: "adventurers_experience",
    img: `/materials/adventurers_experience.png`,
    name: "Adventurer's Experience",
    value: 5000,
  },
  {
    id: "wanderers_advice",
    img: `/materials/wanderers_advice.png`,
    name: "Wanderer's Advice",
    value: 1000,
  },
];

const CharacterCalculator = ({ characters, lvlExp }: Props) => {
  const [result, setResult] = useState<Result[]>([]);
  const [expWasted, setExpWasted] = useState(0);
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
    setExpWasted(0);

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
            img: `/${item.type}/${item.id}.png`,
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
            img: `/${item.type}/${item.id}.png`,
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
            img: `/${item.type}/${item.id}.png`,
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
            img: `/${item.type}/${item.id}.png`,
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

    if (moraNeeded > 0) {
      newresult.push({
        id: "mora",
        img: `/materials/mora.png`,
        name: "Mora",
        amount: moraNeeded,
      });
    }

    if (current < 0) {
      setExpWasted(current);
    }

    setResult(newresult);
  };

  const canCalculate = useMemo(() => {
    const characterIsSelected = !!character;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;
    const intendedTalent1IsAcceptable = intendedTalent1Lvl >= currentTalent1Lvl;
    const intendedTalent2IsAcceptable = intendedTalent2Lvl >= currentTalent2Lvl;
    const intendedTalent3IsAcceptable = intendedTalent3Lvl >= currentTalent3Lvl;

    return (
      characterIsSelected &&
      intendedLevelIsAcceptable &&
      intendedTalent1IsAcceptable &&
      intendedTalent2IsAcceptable &&
      intendedTalent3IsAcceptable
    );
  }, [
    character,
    currentLevel,
    currentTalent1Lvl,
    currentTalent2Lvl,
    currentTalent3Lvl,
    intendedLevel,
    intendedTalent1Lvl,
    intendedTalent2Lvl,
    intendedTalent3Lvl,
  ]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <div>Calculate Ascnesion materials?</div>
        <div>
          <Select
            options={characters.map((c) => ({ id: c.id, name: c.name }))}
            onChange={(option) =>
              setCharacter(characters.find((c) => c.id === option.id)!!)
            }
            selectedIconRender={(selected) => (
              <img
                className="w-6 h-6 mr-2"
                src={getUrl(
                  `/characters/${selected.id}/${selected.id}_portrait.png`,
                  32,
                  32
                )}
                alt={selected.name}
              />
            )}
            itemsListRender={(option) => (
              <>
                <img
                  className="w-6 h-6 mr-3"
                  src={getUrl(
                    `/characters/${option.id}/${option.id}_portrait.png`,
                    32,
                    32
                  )}
                  alt={option.name}
                />
                <span className="flex-1 text-base">{option.name}</span>
              </>
            )}
          />
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
                    "flex items-center justify-center font-semibold rounded-full w-10 h-10 leading-none flex-col hover:bg-vulcan-400",
                    level.lvl === currentLevel.lvl &&
                      level.asclLvl === currentLevel.asclLvl
                      ? "bg-gray-500"
                      : "bg-vulcan-500"
                  )}
                >
                  <div className="">{level.lvl}</div>
                  <img
                    src={getUrl(`/ascension.png`, 16, 16)}
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
                    "flex items-center justify-center font-semibold rounded-full w-10 h-10 leading-none flex-col hover:bg-vulcan-400",
                    level.lvl === intendedLevel.lvl &&
                      level.asclLvl === intendedLevel.asclLvl
                      ? "bg-gray-500"
                      : "bg-vulcan-500"
                  )}
                >
                  <div className="">{level.lvl}</div>
                  <img
                    src={getUrl(`/ascension.png`, 16, 16)}
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
        <div className="grid grid-cols-3 gap-2">
          <div className="my-2 text-center">
            <span className="bg-gray-600 rounded p-1 text-xs mr-1 font-bold">
              AA
            </span>
            Auto Attack
          </div>
          <div className="my-2 text-center">
            <span className="bg-gray-600 rounded p-1 text-xs mr-1 font-bold">
              E
            </span>
            Skill
          </div>
          <div className="my-2 text-center">
            <span className="bg-gray-600 rounded p-1 text-xs mr-1 font-bold">
              Q
            </span>
            Burst
          </div>
        </div>
        <div>Current Level</div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={currentTalent1Lvl}
            onChange={(e) => setCurrentTalent1Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={currentTalent2Lvl}
            onChange={(e) => setCurrentTalent2Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={currentTalent3Lvl}
            onChange={(e) => setCurrentTalent3Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
        </div>
        <div>Intended Level</div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={intendedTalent1Lvl}
            onChange={(e) => setIntendedTalent1Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={intendedTalent2Lvl}
            onChange={(e) => setIntendedTalent2Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={intendedTalent3Lvl}
            onChange={(e) => setIntendedTalent3Lvl(Number(e.target.value))}
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div>
          <Button disabled={!canCalculate} onClick={calculate}>
            Calculate
          </Button>
        </div>
        {result.length > 0 && (
          <div className="w-full lg:w-auto">
            <div className="bg-vulcan-900 rounded-lg p-4 mt-2 block md:inline-block">
              <table>
                {result.map((res) => (
                  <tr key={res.name}>
                    <td className="text-right border-b border-gray-800 py-1">
                      <div className="text-white mr-2 whitespace-no-wrap">
                        <span className="mr-2">
                          {numFormat.format(res.amount)}
                        </span>
                        <span>x</span>
                      </div>
                    </td>
                    <td className="border-b border-gray-800 py-1">
                      <span className="text-white">
                        <span className="w-7 inline-block">
                          <img
                            className="h-7 inline-block mr-1"
                            src={getUrl(res.img, 32, 32)}
                            alt={res.name}
                          />
                        </span>
                        {res.name}
                      </span>
                    </td>
                  </tr>
                ))}
                {expWasted < 0 && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <span className="text-center italic text-pink-900">
                        EXP Wasted {numFormat.format(expWasted)}
                      </span>
                    </td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCalculator;
