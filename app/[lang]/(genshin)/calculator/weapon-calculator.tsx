"use client";

import clsx from "clsx";
import { CalculationItemResult } from "interfaces/calculator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { toast } from "sonner";

import Select from "@components/Select";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import useLazyFetch from "@hooks/use-lazy-fetch";
import type { Weapon } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";
import { todos } from "@state/todo";
import { levels } from "@utils/totals";

type Props = {
  weapons: Weapon[];
};

export function WeaponCalculator({ weapons }: Props) {
  const [weapon, setWeapon] = useState<Weapon>(weapons[10]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[13]);
  const [addedToTodo, setAddedToTodo] = useState(false);
  const { t, localeGI } = useIntl("calculator");
  const [calculate, { called, loading, data, error, reset }] = useLazyFetch<
    CalculationItemResult[]
  >("genshin/calculate_weapon_level");

  // Reset added to todo state when data changes
  useEffect(() => {
    if (data) {
      setAddedToTodo(false);
    }
  }, [data]);

  const canCalculate = useMemo(() => {
    const weaponIsSelected = !!weapon;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;

    return weaponIsSelected && intendedLevelIsAcceptable;
  }, [weapon, currentLevel, intendedLevel]);

  const addToTodo = useCallback(() => {
    if (!data) {
      toast.error(
        t({
          id: "no_data_to_add",
          defaultMessage: "No calculation data to add to todo list",
        }),
      );
      return;
    }

    trackClick("calculator_add_weapon_todo");
    setAddedToTodo(true);
    const resourcesMap = data?.reduce(
      (map: any, item: any) => {
        map[item.id] = item.amount;
        return map;
      },
      {} as Record<string, number>,
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

    toast.success(
      t({ id: "added_to_todo_list", defaultMessage: "Added to Todo List" }),
    );
  }, [
    currentLevel.asc,
    currentLevel.lvl,
    data,
    intendedLevel.asc,
    intendedLevel.lvl,
    t,
    weapon.id,
    weapon.name,
    weapon.rarity,
  ]);

  const validationErrors = useMemo(() => {
    const errors = [];

    if (!weapon) {
      errors.push(
        t({
          id: "weapon_not_selected",
          defaultMessage: "Please select a weapon",
        }),
      );
    }

    if (intendedLevel.lvl < currentLevel.lvl) {
      errors.push(
        t({
          id: "intended_level_error",
          defaultMessage: "Intended level must be higher than current level",
        }),
      );
    }

    return errors;
  }, [weapon, currentLevel.lvl, intendedLevel.lvl, t]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <div className="flex flex-col">
        <span className="my-4 block text-lg font-medium">
          {t({ id: "weapon_level", defaultMessage: "Weapon Level" })}
        </span>
        <div className="mb-4">
          <label
            htmlFor="weapon-select"
            className="mb-2 block text-sm font-medium"
          >
            {t({ id: "select_weapon", defaultMessage: "Select Weapon" })}
          </label>
          <Select
            options={weapons.map((w) => ({ id: w.id, name: w.name }))}
            onChange={(option) => {
              setWeapon(weapons.find((w) => w.id === option.id)!!);
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
            groupBy={(option) => {
              const foundWeapon = weapons.find((w) => w.id === option.id);
              return foundWeapon ? `★${foundWeapon.rarity}` : "";
            }}
          />
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-medium">
            {t({ id: "current_level", defaultMessage: "Current Level" })}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none focus:ring-2 focus:ring-vulcan-500/50",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : "",
                )}
                onClick={() => {
                  setCurrentLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
                aria-label={`${t({ id: "level", defaultMessage: "Level" })} ${level.lvl}${level.asc ? "+" : ""}`}
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
                  alt={level.asc ? "Ascended" : "Not Ascended"}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-2 mt-4 block text-sm font-medium">
            {t({ id: "intended_level", defaultMessage: "Intended Level" })}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none focus:ring-2 focus:ring-vulcan-500/50",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : "",
                  level.lvl < currentLevel.lvl
                    ? "cursor-not-allowed opacity-50"
                    : "",
                )}
                onClick={() => {
                  if (level.lvl >= currentLevel.lvl) {
                    setIntendedLevel(level);
                    reset();
                    setAddedToTodo(false);
                  }
                }}
                disabled={level.lvl < currentLevel.lvl}
                aria-label={`${t({ id: "level", defaultMessage: "Level" })} ${level.lvl}${level.asc ? "+" : ""}`}
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
                  alt={level.asc ? "Ascended" : "Not Ascended"}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty column for spacer */}
      <div></div>

      <div className="flex flex-col items-center justify-center">
        {validationErrors.length > 0 && (
          <div className="mb-4 w-full rounded-md bg-red-500/20 p-3 text-sm text-red-200">
            <ul className="list-inside list-disc">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <Button
            disabled={!canCalculate || loading}
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
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="mr-2 animate-spin" />
                {t({ id: "calculating", defaultMessage: "Calculating..." })}
              </span>
            ) : (
              t({ id: "calculate", defaultMessage: "Calculate" })
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 w-full rounded-md bg-red-500/20 p-4">
            <p className="text-center text-red-200">
              {t({
                id: "calculation_error",
                defaultMessage: "Error occurred during calculation",
              })}
            </p>
          </div>
        )}

        {called && !loading && data && (
          <div className="w-full lg:w-auto">
            <div className="mt-4 block rounded-lg bg-vulcan-900 p-4 md:inline-block">
              <h3 className="mb-2 text-center text-lg font-medium">
                {t({
                  id: "calculation_result",
                  defaultMessage: "Calculation Result",
                })}
              </h3>

              <div className="flex items-center justify-center py-2">
                <div className="flex items-center rounded-md bg-vulcan-800/50 p-2">
                  <img
                    className="mr-2 h-10 w-10 rounded-full bg-vulcan-700/50 p-1"
                    src={getUrl(`/weapons/${weapon.id}.png`, 40, 40)}
                    alt={weapon.name}
                  />
                  <div className="text-center">
                    <p className="font-medium text-white">{weapon.name}</p>
                    <p className="text-xs text-gray-400">
                      {currentLevel.lvl}
                      {currentLevel.asc ? "+" : ""} → {intendedLevel.lvl}
                      {intendedLevel.asc ? "+" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-2 text-right">
                      {t({ id: "amount", defaultMessage: "Amount" })}
                    </th>
                    <th className="pb-2 text-left">
                      {t({ id: "material", defaultMessage: "Material" })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((res) => (
                    <tr key={res.name}>
                      <td className="border-b border-gray-800 py-1 text-right">
                        <div className="whitespace-no-wrap mr-2 text-white">
                          <span className="mr-2">
                            {numFormat.format(res.amount)}
                          </span>
                          <span>×</span>
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

              <div className="mt-4 flex justify-center">
                {addedToTodo ? (
                  <div className="inline-flex items-center justify-center p-1 text-green-400">
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
