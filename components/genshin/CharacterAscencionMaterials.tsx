"use client";

import clsx from "clsx";
import type { Ascension } from "@interfaces/genshin/dist/types/character";
import { memo, useMemo } from "react";

import SimpleRarityBox from "../SimpleRarityBox";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { calculateTotalAscensionMaterials } from "@utils/totals";

type Props = {
  ascension: Ascension[];
};

const CharacterAscencionMaterials = ({ ascension }: Props) => {
  const { t } = useIntl("character");
  const ascensionTotal = useMemo(
    () => calculateTotalAscensionMaterials(ascension),
    [ascension]
  );

  return (
    <>
      {ascension.map((ascen, i) => (
        <div
          key={ascen.level.join()}
          className={clsx(
            "grid grid-cols-6 items-center px-4 lg:grid-cols-10",
            {
              "bg-vulcan-700": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            }
          )}
        >
          <div className="flex items-center justify-center text-sm lg:text-base">
            LV.{ascen.level.join(" - ")}
          </div>
          <div className="flex items-center justify-center">
            <SimpleRarityBox
              img={getUrl(`/materials/mora.png`, 64, 64)}
              name={ascen?.cost?.toString() || "0"}
              rarity={1}
              className="h-16 w-16"
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
                  className="h-16 w-16"
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
                  className="h-16 w-16"
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
                  className="h-16 w-16"
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
                  className="h-16 w-16"
                />
                <p className="hidden lg:block">{ascen.mat4.name}</p>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-7 items-center rounded-b bg-vulcan-700 px-4 py-5 lg:grid-cols-11">
        <div className="flex items-center justify-center text-sm font-bold lg:text-base">
          {t({ id: "total", defaultMessage: "Total" })}
        </div>
        <div className="flex items-center justify-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            name={ascensionTotal.cost.toString()}
            rarity={1}
            className="h-16 w-16"
          />
        </div>
        {ascensionTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/${item.id}.png`, 64, 64)}
              name={item.amount.toString()}
              rarity={item.rarity}
              className="h-16 w-16"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(CharacterAscencionMaterials);
