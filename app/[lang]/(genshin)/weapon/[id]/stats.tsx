"use client";

import clsx from "clsx";
import type { Weapon } from "@interfaces/genshin";
import { useState } from "react";

import useIntl from "@hooks/use-intl";

type Props = {
  weapon: Weapon;
};

export default function WeaponStats({ weapon }: Props) {
  const { t } = useIntl("weapon");
  const [refinement, setRefinement] = useState(0);
  const [weaponStatIndex, setWeaponStatIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <div className="float-right">
          <button
            className={clsx("mx-2 my-1 rounded border p-1 px-4", {
              "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                weaponStatIndex > 0,
              "border-gray-800 bg-vulcan-800": weaponStatIndex === 0,
            })}
            disabled={weaponStatIndex === 0}
            onClick={() => setWeaponStatIndex(weaponStatIndex - 1)}
          >
            -
          </button>
          <button
            className={clsx("mx-2 my-1 rounded border p-1 px-4", {
              "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                weaponStatIndex < weapon.stats.levels.length,
              "border-gray-800 bg-vulcan-800":
                weaponStatIndex === weapon.stats.levels.length - 1,
            })}
            disabled={weaponStatIndex === weapon.stats.levels.length - 1}
            onClick={() => setWeaponStatIndex(weaponStatIndex + 1)}
          >
            +
          </button>
        </div>
        <h2 className="mb-2 text-3xl text-white">
          {t({ id: "stats", defaultMessage: "Stats" })}
        </h2>
        <div className="card">
          <div className="grid grid-cols-2">
            <div>
              <div className="text-xl">
                {weapon.stats.primary}:{" "}
                {weapon.stats.levels[weaponStatIndex]?.primary}
              </div>
              {weapon.stats.secondary && (
                <div className="text-xl">
                  {weapon.stats.secondary}:{" "}
                  {weapon.stats.levels[weaponStatIndex]?.secondary}
                </div>
              )}
            </div>
            <div>
              <div>
                <div className="text-xl">
                  {t({ id: "level", defaultMessage: "Level" })}:{" "}
                  {weapon.stats.levels[weaponStatIndex]?.level}
                </div>
                <div className="text-xl">
                  {t({ id: "ascension", defaultMessage: "Ascension" })}:{" "}
                  {weapon.stats.levels[weaponStatIndex]?.ascension}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <div className="float-right">
          <button
            className={clsx("mx-2 my-1 rounded border p-1 px-4", {
              "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                refinement > 0,
              "border-gray-800 bg-vulcan-800": refinement === 0,
            })}
            disabled={refinement === 0}
            onClick={() => setRefinement(refinement - 1)}
          >
            -
          </button>
          <button
            className={clsx("mx-2 my-1 rounded border p-1 px-4", {
              "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                refinement < weapon.refinements.length - 1,
              "border-gray-800 bg-vulcan-800":
                refinement === weapon.refinements.length - 1,
            })}
            disabled={refinement === weapon.refinements.length - 1}
            onClick={() => setRefinement(refinement + 1)}
          >
            +
          </button>
        </div>
        <h2 className="mb-2 text-3xl text-white">
          {t({ id: "refinement", defaultMessage: "Refinement" })}
        </h2>
        <div className="card">
          <div
            dangerouslySetInnerHTML={{
              __html: weapon.refinements[refinement]?.desc,
            }}
          />
        </div>
      </div>
    </div>
  );
}
