"use client";

import clsx from "clsx";
import { WeaponAscension } from "genshin-data/dist/types/weapon";
import { memo, useMemo } from "react";

import { getUrl } from "@lib/imgUrl";
import { calculateTotalWeaponAscensionMaterials } from "@utils/totals";
import SimpleRarityBox from "../SimpleRarityBox";

type Props = {
  ascension: WeaponAscension[];
};

const WeaponAscensionMaterials = ({ ascension }: Props) => {
  const talentsTotal = useMemo(
    () => calculateTotalWeaponAscensionMaterials(ascension),
    [ascension]
  );

  return (
    <>
      {ascension
        .filter((ascen) => ascen.materials.length > 0)
        .map((ascen, i) => (
          <div
            key={ascen.ascension}
            className={clsx(
              "grid grid-cols-6 items-center px-4 lg:grid-cols-10",
              {
                "bg-vulcan-700": i % 2 === 0,
                "rounded rounded-b-none": i === 0,
              }
            )}
          >
            <div className="flex items-center justify-center text-sm lg:text-base">
              Ascension {ascen.ascension}
            </div>
            <div className="flex items-center justify-center text-sm lg:text-base">
              [{ascension[i].level}/{ascen.level}]
            </div>
            <div className="flex items-center justify-center">
              <SimpleRarityBox
                img={getUrl(`/materials/mora.png`, 64, 64)}
                placeholderSrc={getUrl(`/materials/mora.png`, 4, 4)}
                name={ascen.cost?.toString()}
                rarity={1}
                className="h-16 w-16"
              />
              <p className="hidden lg:block">Mora</p>
            </div>
            {ascen.materials.map((mat) => (
              <div
                key={mat.id + mat.amount}
                className="flex items-center lg:col-span-2"
              >
                <SimpleRarityBox
                  img={getUrl(`/materials/${mat.id}.png`, 64, 64)}
                  placeholderSrc={getUrl(`/materials/${mat.id}.png`, 4, 4)}
                  name={mat.amount.toString()}
                  rarity={mat.rarity}
                  className="h-16 w-16"
                />
                <p className="hidden lg:block">{mat.name}</p>
              </div>
            ))}
          </div>
        ))}
      <div className="grid grid-cols-6 items-center rounded-b bg-vulcan-700 px-4 py-5 lg:grid-cols-12">
        <div className="flex items-center justify-center text-sm font-bold lg:text-base">
          TOTAL
        </div>
        <div className="flex items-center justify-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            placeholderSrc={getUrl(`/materials/mora.png`, 4, 4)}
            name={talentsTotal.cost.toString()}
            rarity={1}
            className="h-16 w-16"
          />
        </div>
        {talentsTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/${item.id}.png`, 64, 64)}
              placeholderSrc={getUrl(`/materials/${item.id}.png`, 4, 4)}
              name={item.amount.toString()}
              rarity={item.rarity || 1}
              className="h-16 w-16"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(WeaponAscensionMaterials);
