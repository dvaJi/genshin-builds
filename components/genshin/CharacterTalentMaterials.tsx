"use client";

import clsx from "clsx";
import type { AscensionMaterial } from "genshin-data/dist/types/character";
import { memo, useMemo } from "react";

import SimpleRarityBox from "../SimpleRarityBox";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { calculateTotalTalentMaterials } from "@utils/totals";

type TalentMaterial = {
  level: number;
  cost: number;
  items: AscensionMaterial[];
};

type Props = {
  talents: TalentMaterial[];
};

const CharacterTalentMaterials = ({ talents }: Props) => {
  const { t } = useIntl("character");
  const talentsTotal = useMemo(
    () => calculateTotalTalentMaterials(talents),
    [talents]
  );

  return (
    <>
      {talents.map((talent, i) => (
        <div
          key={talent.level}
          className={clsx(
            "grid grid-cols-6 items-center px-4 lg:grid-cols-10",
            {
              "bg-vulcan-700": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            }
          )}
        >
          <div className="flex items-center justify-center text-sm lg:text-base">
            LV.{talent.level - 1}→{talent.level}
          </div>
          <div className="flex items-center justify-center">
            <SimpleRarityBox
              img={getUrl(`/materials/mora.png`, 64, 64)}
              name={talent.cost.toString()}
              rarity={1}
              className="h-16 w-16"
            />
            <p className="hidden lg:block">Mora</p>
          </div>
          <div className="flex items-center lg:col-span-2">
            <SimpleRarityBox
              img={getUrl(`/materials/${talent.items[0].id}.png`, 64, 64)}
              name={talent.items[0].amount.toString()}
              rarity={talent.items[0].rarity || 1}
              className="h-16 w-16"
            />
            <p className="hidden lg:block">{talent.items[0].name}</p>
          </div>
          <div className="flex items-center lg:col-span-2">
            <SimpleRarityBox
              img={getUrl(`/materials/${talent.items[1].id}.png`, 64, 64)}
              name={talent.items[1].amount.toString()}
              rarity={talent.items[1].rarity || 1}
              className="h-16 w-16"
            />
            <p className="hidden lg:block">{talent.items[1].name}</p>
          </div>
          <div className="flex items-center lg:col-span-2">
            {talent.items.length > 2 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${talent.items[2].id}.png`, 64, 64)}
                  name={talent.items[2].amount.toString()}
                  rarity={talent.items[2].rarity || 1}
                  className="h-16 w-16"
                />
                <p className="hidden lg:block">{talent.items[2].name}</p>
              </>
            )}
          </div>
          <div className="flex items-center lg:col-span-2">
            {talent.items.length > 3 && (
              <>
                <SimpleRarityBox
                  img={getUrl(`/materials/${talent.items[3].id}.png`, 64, 64)}
                  name={talent.items[3].amount.toString()}
                  rarity={talent.items[3].rarity || 1}
                  className="h-16 w-16"
                />
                <p className="hidden lg:block">{talent.items[3].name}</p>
              </>
            )}
          </div>
        </div>
      ))}
      <div className="grid grid-cols-6 items-center rounded-b px-4 py-5 lg:grid-cols-10">
        <div className="flex items-center justify-center text-sm font-bold uppercase lg:text-base">
          {t({ id: "total", defaultMessage: "Total" })}
        </div>
        <div className="flex items-center justify-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            name={talentsTotal.cost.toString()}
            rarity={1}
            className="h-16 w-16"
          />
        </div>
        {talentsTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/${item.id}.png`, 64, 64)}
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

export default memo(CharacterTalentMaterials);
