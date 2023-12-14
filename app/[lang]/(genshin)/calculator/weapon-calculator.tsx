"use client";

import clsx from "clsx";
import type { Weapon } from "genshin-data";
import { useCallback, useMemo, useState } from "react";
import { GiCheckMark } from "react-icons/gi";

import Select from "@components/Select";
import Button from "@components/ui/Button";

import useIntl from "@hooks/use-intl";
import useLazyFetch from "@hooks/use-lazy-fetch";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";
import { todos } from "@state/todo";
import { levels } from "@utils/totals";
import { CalculationItemResult } from "interfaces/calculator";

type Props = {
  weapons: Weapon[];
};

export function WeaponCalculator({ weapons }: Props) {
  const [weapon, setWeapon] = useState<Weapon>(weapons[10]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[13]);
  const [addedToTodo, setAddedToTodo] = useState(false);
  const { t, localeGI } = useIntl("calculator");
  const [calculate, { called, loading, data, reset }] = useLazyFetch<
    CalculationItemResult[]
  >("genshin/calculate_weapon_level");

  const canCalculate = useMemo(() => {
    const weaponIsSelected = !!weapon;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;

    return weaponIsSelected && intendedLevelIsAcceptable;
  }, [weapon, currentLevel, intendedLevel]);

  const addToTodo = useCallback(() => {
    trackClick("calculator_add_weapon_todo");
    setAddedToTodo(true);
    const resourcesMap = data?.reduce(
      (map: any, item: any) => {
        map[item.id] = item.amount;
        return map;
      },
      {} as Record<string, number>
    );

    todos.set([
      ...(todos.get() || []),
      [
        { id: weapon.id, name: weapon.name, r: weapon.rarity },
        "weapons",
        [
          currentLevel.lvl,
          currentLevel.asc,
          intendedLevel.lvl,
          intendedLevel.asc,
        ],
        {},
        resourcesMap,
        resourcesMap,
      ],
    ]);
  }, [
    currentLevel.asc,
    currentLevel.lvl,
    data,
    intendedLevel.asc,
    intendedLevel.lvl,
    weapon.id,
    weapon.name,
    weapon.rarity,
  ]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <span className="my-4 text-lg">
          {t({ id: "choose_weapon", defaultMessage: "Choose Weapon" })}
        </span>
        <div>
          <Select
            options={weapons.map((c) => ({ id: c.id, name: c.name }))}
            onChange={(option) => {
              setWeapon(weapons.find((c) => c.id === option.id)!!);
              reset();
              setAddedToTodo(false);
            }}
            selectedIconRender={(selected) => (
              <img
                className="mr-2 h-6 w-6"
                src={getUrl(`/weapons/${selected.id}.png`, 32, 32)}
                alt={selected.name}
              />
            )}
            itemsListRender={(option) => (
              <>
                <img
                  className="mr-3 h-6 w-6"
                  src={getUrl(`/weapons/${option.id}.png`, 32, 32)}
                  alt={option.name}
                />
                <span className="flex-1 text-base">{option.name}</span>
              </>
            )}
          />
        </div>
        <div className="mt-4">
          <span>
            {t({ id: "current_level", defaultMessage: "Current Level" })}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : ""
                )}
                onClick={() => {
                  setCurrentLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
              >
                <div className="font-semibold">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
                  width={16}
                  height={16}
                  className={clsx("w-4", {
                    "opacity-100": level.asc,
                    "opacity-25": !level.asc,
                  })}
                  alt="ascension"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span>
            {t({ id: "intended_level", defaultMessage: "Intended Level" })}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : ""
                )}
                onClick={() => {
                  setIntendedLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
              >
                <div className="">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
                  width={16}
                  height={16}
                  className={clsx("w-4", {
                    "opacity-100": level.asc,
                    "opacity-25": !level.asc,
                  })}
                  alt="ascension"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex flex-col items-center justify-center">
        <div>
          <Button
            disabled={!canCalculate}
            onClick={() => {
              trackClick("calculate_weapon");
              calculate({
                weaponId: weapon.id,
                lang: localeGI,
                params: {
                  currentLevel: currentLevel,
                  intendedLevel: intendedLevel,
                },
              });
            }}
          >
            {t({ id: "calculate", defaultMessage: "Calculate" })}
          </Button>
        </div>
        {called && !loading && data && (
          <div className="w-full lg:w-auto">
            <div className="mt-2 block rounded-lg bg-vulcan-900 p-4 md:inline-block">
              <table>
                <tbody>
                  {data.map((res) => (
                    <tr key={res.name}>
                      <td className="border-b border-gray-800 py-1 text-right">
                        <div className="whitespace-no-wrap mr-2 text-white">
                          <span className="mr-2">
                            {numFormat.format(res.amount)}
                          </span>
                          <span>x</span>
                        </div>
                      </td>
                      <td className="border-b border-gray-800 py-1">
                        <span className="text-white">
                          <span className="inline-block w-7">
                            <img
                              className="mr-1 inline-block h-7"
                              src={getUrl(res.img, 32, 32)}
                              alt={res.name}
                            />
                          </span>
                          {res.name}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex justify-center">
                {addedToTodo ? (
                  <div className="inline-flex content-center justify-center p-1">
                    <GiCheckMark className="mr-2" />
                    <span>
                      {t({
                        id: "added_to_todo_list",
                        defaultMessage: "Added to Todo List",
                      })}
                    </span>
                  </div>
                ) : (
                  <Button onClick={addToTodo}>
                    {t({
                      id: "add_to_todo_list",
                      defaultMessage: "Add to Todo List",
                    })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
