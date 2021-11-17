import clsx from "clsx";
import { useMemo, useState } from "react";
import { Weapon } from "genshin-data";

import Button from "./Button";
import Select from "./Select";

import { getUrl } from "@lib/imgUrl";
import { levels } from "@utils/totals";
import useIntl from "@hooks/use-intl";
import useLazyQuery from "@hooks/use-lazy-gql";

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
  const [intendedLevel, setIntendedLevel] = useState(levels[0]);
  const { t, localeGI } = useIntl();
  const [calculate, { called, loading, data }] = useLazyQuery(QUERY);

  const canCalculate = useMemo(() => {
    const weaponIsSelected = !!weapon;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;

    return weaponIsSelected && intendedLevelIsAcceptable;
  }, [weapon, currentLevel, intendedLevel]);

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
        <div className="mt-4">
          <span>
            {t({ id: "current_level", defaultMessage: "Current Level" })}
          </span>
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
          <span>
            {t({ id: "intended_level", defaultMessage: "Intended Level" })}
          </span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaponCalculator;
