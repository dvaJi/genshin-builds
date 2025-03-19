"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import SimpleRarityBox from "@components/SimpleRarityBox";
import type { WeaponAscension } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import { cn } from "@lib/utils";
import type { AscensionTotal } from "@utils/totals";

type Props = {
  ascension: WeaponAscension[];
  ascensionTotal: AscensionTotal;
};

const WeaponAscensionMaterials = ({ ascension, ascensionTotal }: Props) => {
  const t = useTranslations("Genshin.weapon");

  return (
    <>
      {ascension.map((ascen, i) => (
        <div
          key={`${ascen.level}-${i}`}
          className={cn(
            "grid grid-cols-[0.8fr_repeat(5,1fr)] items-center gap-1 px-2 sm:grid-cols-6 sm:gap-2 sm:px-4 lg:grid-cols-10",
            {
              "bg-muted/70": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            },
          )}
        >
          <div className="flex items-center justify-center text-xs font-medium sm:text-sm lg:text-base">
            {t("lv")}
            {ascen.level}
          </div>
          <div className="flex items-center justify-center">
            <SimpleRarityBox
              img={getUrl(`/materials/mora.png`, 64, 64)}
              name={ascen?.cost?.toString() || "0"}
              rarity={1}
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            />
            <p className="hidden lg:block">Mora</p>
          </div>
          {[
            ascen.materials[0],
            ascen.materials[1],
            ascen.materials[2],
            ascen.materials[3],
          ].map((material, index) => (
            <div
              key={material?.id || index}
              className="flex items-center lg:col-span-2"
            >
              {material && (
                <>
                  <SimpleRarityBox
                    img={getUrl(`/materials/${material.id}.png`, 64, 64)}
                    name={material.amount.toString()}
                    rarity={material.rarity || 1}
                    className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  />
                  <p className="hidden lg:block">{material.name}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
      <div className="grid grid-cols-[0.8fr_repeat(5,1fr)] items-center gap-1 rounded-b bg-muted px-2 py-3 sm:grid-cols-6 sm:gap-2 sm:px-4 sm:py-4 lg:grid-cols-10">
        <div className="flex items-center justify-center text-xs font-bold uppercase sm:text-sm lg:text-base">
          {t("total")}
        </div>
        <div className="flex items-center justify-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            name={ascensionTotal.cost.toString()}
            rarity={1}
            className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          />
        </div>
        {ascensionTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/${item.id}.png`, 64, 64)}
              name={item.amount.toString()}
              rarity={item.rarity}
              className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(WeaponAscensionMaterials);
