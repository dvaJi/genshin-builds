import { useMemo, useState } from "react";
import clsx from "clsx";
import { Weapon } from "genshin-data";

import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

import { getUrl } from "@lib/imgUrl";
import {
  calculateTotalAscensionMaterials,
  calculateTotalTalentMaterials,
  calculateTotalWeaponAscensionMaterials,
  levels,
} from "@utils/totals";

type Props = {
  weapons: Weapon[];
  lvlExp: number[][];
};

type Result = {
  id: string;
  img: string;
  name: string;
  amount: number;
};

const weaponExpMaterial = [
  {
    id: "mystic_enhancement_ore",
    img: `/materials/mystic_enhancement_ore.png`,
    name: "Mystic Enhancement Ore",
    value: 10000,
  },
  {
    id: "fine_enhancement_ore",
    img: `/materials/fine_enhancement_ore.png`,
    name: "Fine Enhancement Ore",
    value: 2000,
  },
  {
    id: "enhancement_ore",
    img: `/materials/enhancement_ore.png`,
    name: "Enhancement Ore",
    value: 400,
  },
];

const WeaponCalculator = ({ weapons, lvlExp }: Props) => {
  const [result, setResult] = useState<Result[]>([]);
  const [expWasted, setExpWasted] = useState(0);
  const [weapon, setWeapon] = useState<Weapon>(weapons[10]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[0]);

  const calculate = () => {
    setResult([]);
    setExpWasted(0);

    let current = 0;
    let moraNeeded = 0;
    let newresult: Result[] = [];

    // Calculate EXP
    if (intendedLevel.lvl >= currentLevel.lvl) {
      const target =
        lvlExp[weapon.rarity - 3][intendedLevel.lvl - 1] -
        (lvlExp[weapon.rarity - 3][currentLevel.lvl - 1] + 0);
      current = target;
      moraNeeded = (Math.floor(target / 1000) * 1000) / 5;

      for (const expItem of weaponExpMaterial) {
        if (weaponExpMaterial[2].id === expItem.id) {
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
    if (weapon) {
      if (currentLevel.asclLvl < intendedLevel.asclLvl) {
        const { cost, items } = calculateTotalWeaponAscensionMaterials(
          weapon.ascensions,
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
    const weaponIsSelected = !!weapon;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;

    return weaponIsSelected && intendedLevelIsAcceptable;
  }, [weapon, currentLevel, intendedLevel]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <div>Calculate Ascnesion materials?</div>
        <div>
          <Select
            options={weapons.map((c) => ({ id: c.id, name: c.name }))}
            onChange={(option) =>
              setWeapon(weapons.find((c) => c.id === option.id)!!)
            }
            selectedIconRender={(selected) => (
              <img
                className="w-6 h-6 mr-2"
                src={getUrl(`/weapons/${selected.id}.png`, 32, 32)}
                alt={selected.name}
              />
            )}
            itemsListRender={(option) => (
              <>
                <img
                  className="w-6 h-6 mr-3"
                  src={getUrl(`/weapons/${option.id}.png`, 32, 32)}
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
      <div></div>
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

export default WeaponCalculator;
