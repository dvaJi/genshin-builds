import clsx from "clsx";
import { memo } from "react";
import { AscensionMaterial } from "genshin-data/dist/types/character";

import SimpleRarityBox from "./SimpleRarityBox";

import { getUrl } from "@lib/imgUrl";

type TalentMaterial = {
  level: number;
  cost: number;
  items: AscensionMaterial[];
};

type Props = {
  talents: TalentMaterial[];
};

const CharacterTalentMaterials = ({ talents }: Props) => {
  return (
    <>
      {talents.map((talent, i) => (
        <div
          key={talent.level}
          className={clsx(
            "grid grid-cols-6 lg:grid-cols-10 items-center px-4",
            {
              "bg-vulcan-700": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            }
          )}
        >
          <div className="flex justify-center items-center text-sm lg:text-base">
            LV.{talent.level - 1}→{talent.level}
          </div>
          <div className="flex justify-center items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/mora.png`, 64, 64)}
              name={talent.cost.toString()}
              rarity={1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">Mora</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={getUrl(
                `/talent_lvl_up_materials/${talent.items[0].id}.png`,
                64,
                64
              )}
              name={talent.items[0].amount.toString()}
              rarity={talent.items[0].rarity || 1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">{talent.items[0].name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={getUrl(
                `/common_materials/${talent.items[1].id}.png`,
                64,
                64
              )}
              name={talent.items[1].amount.toString()}
              rarity={talent.items[1].rarity || 1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">{talent.items[1].name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            {talent.items.length > 2 && (
              <>
                <SimpleRarityBox
                  img={getUrl(
                    `/talent_lvl_up_materials/${talent.items[2].id}.png`,
                    64,
                    64
                  )}
                  name={talent.items[2].amount.toString()}
                  rarity={talent.items[2].rarity || 1}
                  className="w-16 h-16"
                />
                <p className="hidden lg:block">{talent.items[2].name}</p>
              </>
            )}
          </div>
          <div className="lg:col-span-2 flex items-center">
            {talent.items.length > 3 && (
              <>
                <SimpleRarityBox
                  img={getUrl(
                    `/talent_lvl_up_materials/${talent.items[3].id}.png`,
                    64,
                    64
                  )}
                  name={talent.items[3].amount.toString()}
                  rarity={talent.items[3].rarity || 1}
                  className="w-16 h-16"
                />
                <p className="hidden lg:block">{talent.items[3].name}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(CharacterTalentMaterials);
