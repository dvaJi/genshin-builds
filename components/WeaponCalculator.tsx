import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { Weapon } from "genshin-data";

import Button from "./Button";
import Select from "./Select";

import { getUrl } from "@lib/imgUrl";
import { levels } from "@utils/totals";
import useIntl from "@hooks/use-intl";
import useLazyQuery from "@hooks/use-lazy-gql";
import { todos } from "@state/todo";

const QUERY = `
  query CharacterAscensionMaterials(
    $weaponId: String!
    $lang: String!
    $params: CalculateWeaponParams!
  ) {
    calculateWeaponLevel(weaponId: $weaponId, lang: $lang, params: $params) {
      id
      img
      name
      amount
      rarity
    }
  }
`;

type Props = {
  weapons: Weapon[];
};

type Result = {
  id: string;
  img: string;
  name: string;
  amount: number;
};

const WeaponCalculator = ({ weapons }: Props) => {
  const [weapon, setWeapon] = useState<Weapon>(weapons[10]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[13]);
  const { t, localeGI } = useIntl();
  const [calculate, { called, loading, data, reset }] = useLazyQuery(QUERY);

  const canCalculate = useMemo(() => {
    const weaponIsSelected = !!weapon;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;

    return weaponIsSelected && intendedLevelIsAcceptable;
  }, [weapon, currentLevel, intendedLevel]);

  const addToTodo = useCallback(() => {
    const resourcesMap = data.calculateWeaponLevel.reduce(
      (map: any, item: any) => {
        map[item.id] = [
          item.amount,
          item.img.replace("/", "").replaceAll(/\/.*.png/g, ""),
          item.rarity,
        ];
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
    data?.calculateWeaponLevel,
    intendedLevel.asc,
    intendedLevel.lvl,
    weapon.id,
    weapon.name,
    weapon.rarity,
  ]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <span className="text-lg my-4">
          {t({ id: "choose_weapon", defaultMessage: "Choose Weapon" })}
        </span>
        <div>
          <Select
            options={weapons.map((c) => ({ id: c.id, name: c.name }))}
            onChange={(option) => {
              setWeapon(weapons.find((c) => c.id === option.id)!!);
              reset();
            }}
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
        <div className="mt-4">
          <span>
            {t({ id: "current_level", defaultMessage: "Current Level" })}
          </span>
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "flex items-center justify-center font-semibold rounded-full w-10 h-10 m-1 leading-none flex-col transition duration-100 border-2 border-vulcan-400 border-opacity-20 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "text-white border-opacity-100 bg-vulcan-600"
                    : ""
                )}
                onClick={() => {
                  setCurrentLevel(level);
                  reset();
                }}
              >
                <div className="font-semibold">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
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
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "flex items-center justify-center font-semibold rounded-full w-10 h-10 m-1 leading-none flex-col transition duration-100 border-2 border-vulcan-400 border-opacity-20 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "text-white border-opacity-100 bg-vulcan-600"
                    : ""
                )}
                onClick={() => {
                  setIntendedLevel(level);
                  reset();
                }}
              >
                <div className="">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
                  className={clsx("w-4 opacity-25", {
                    "opacity-100": level.asc,
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
            onClick={() =>
              calculate({
                weaponId: weapon.id,
                lang: localeGI,
                params: {
                  currentLevel: currentLevel,
                  intendedLevel: intendedLevel,
                },
              })
            }
          >
            {t({ id: "calculate", defaultMessage: "Calculate" })}
          </Button>
        </div>
        {called && !loading && data && (
          <div className="w-full lg:w-auto">
            <div className="bg-vulcan-900 rounded-lg p-4 mt-2 block md:inline-block">
              <table>
                <tbody>
                  {data.calculateWeaponLevel.map((res: Result) => (
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
                </tbody>
              </table>
              <Button onClick={addToTodo}>Add Todo</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaponCalculator;
