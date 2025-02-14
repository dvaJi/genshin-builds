"use client";

import clsx from "clsx";
import { memo } from "react";

import useIntl from "@hooks/use-intl";
import type { Ascension } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import type { AscensionTotal } from "@utils/totals";

import SimpleRarityBox from "../SimpleRarityBox";

type Props = {
  ascension: Ascension[];
  ascensionTotal: AscensionTotal;
};

const CharacterAscencionMaterials = ({ ascension, ascensionTotal }: Props) => {
  const { t } = useIntl("character");

  return (
    <>
      {ascension.map((ascen, i) => (
        <div
          key={ascen.level.join()}
          className={clsx(
            "grid grid-cols-[0.8fr_repeat(5,1fr)] items-center gap-1 px-2 sm:grid-cols-6 sm:gap-2 sm:px-4 lg:grid-cols-10",
            {
              "bg-muted/70": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            },
          )}
        >
          <div className="flex items-center justify-center text-xs font-medium sm:text-sm lg:text-base">
            LV.{ascen.level.join(" - ")}
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
          <div className="flex items-center lg:col-span-2">
            {ascen?.mat1 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${ascen.mat1.id}.png`, 64, 64)}
                  name={ascen.mat1.amount.toString()}
                  rarity={ascen.mat1.rarity}
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                />
                <p className="hidden lg:block">{ascen.mat1.name}</p>
              </>
            )}
          </div>
          <div className="flex items-center lg:col-span-2">
            {ascen.mat2 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${ascen.mat2.id}.png`, 64, 64)}
                  name={ascen.mat2.amount.toString()}
                  rarity={ascen.mat2.rarity || 1}
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                />
                <p className="hidden lg:block">{ascen.mat2.name}</p>
              </>
            )}
          </div>
          <div className="flex items-center lg:col-span-2">
            {ascen.mat3 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${ascen.mat3.id}.png`, 64, 64)}
                  name={ascen.mat3.amount.toString()}
                  rarity={ascen.mat3.rarity || 1}
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                />
                <p className="hidden lg:block">{ascen.mat3.name}</p>
              </>
            )}
          </div>
          <div className="flex items-center lg:col-span-2">
            {ascen.mat4 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${ascen.mat4.id}.png`, 64, 64)}
                  name={ascen.mat4.amount.toString()}
                  rarity={ascen.mat4.rarity || 1}
                  className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                />
                <p className="hidden lg:block">{ascen.mat4.name}</p>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-[0.8fr_repeat(5,1fr)] items-center gap-1 rounded-b bg-muted px-2 py-3 sm:grid-cols-6 sm:gap-2 sm:px-4 sm:py-4 lg:grid-cols-10">
        <div className="flex items-center justify-center text-xs font-bold uppercase sm:text-sm lg:text-base">
          {t({ id: "total", defaultMessage: "Total" })}
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

export default memo(CharacterAscencionMaterials);
