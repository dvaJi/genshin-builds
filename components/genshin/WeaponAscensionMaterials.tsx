"use client";

import clsx from "clsx";
import { memo } from "react";

import type { WeaponAscension } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import type { AscensionTotal } from "@utils/totals";

import SimpleRarityBox from "../SimpleRarityBox";

type Props = {
  ascension: WeaponAscension[];
  ascensionTotal: AscensionTotal;
};

const WeaponAscensionMaterials = ({ ascension, ascensionTotal }: Props) => {
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
                "bg-muted/50": i % 2 === 0,
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
      <div className="grid grid-cols-6 items-center rounded-b bg-muted px-4 py-5 lg:grid-cols-12">
        <div className="flex items-center justify-center text-sm font-bold text-foreground lg:text-base">
          TOTAL
        </div>
        <div className="flex items-center justify-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            placeholderSrc={getUrl(`/materials/mora.png`, 4, 4)}
            name={ascensionTotal.cost.toString()}
            rarity={1}
            className="h-16 w-16"
          />
        </div>
        {ascensionTotal.items.map((item) => (
          <div key={item.id + item.amount} className="flex items-center">
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
