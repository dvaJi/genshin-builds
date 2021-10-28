import { memo, useMemo } from "react";
import { Ascension } from "genshin-data/dist/types/character";
import clsx from "clsx";

import SimpleRarityBox from "./SimpleRarityBox";

import { getUrl } from "@lib/imgUrl";
import { calculateTotalAscensionMaterials } from "@utils/character";

type Props = {
  ascension: Ascension[];
};

const CharacterAscencionMaterials = ({ ascension }: Props) => {
  const ascensionTotal = useMemo(
    () => calculateTotalAscensionMaterials(ascension),
    [ascension]
  );

  return (
    <>
      {ascension.map((ascen, i) => (
        <div
          key={ascen.ascension}
          className={clsx(
            "grid grid-cols-6 lg:grid-cols-10 items-center px-4",
            {
              "bg-vulcan-700": i % 2 === 0,
              "rounded rounded-b-none": i === 0,
            }
          )}
        >
          <div className="flex justify-center items-center text-sm lg:text-base">
            LV.{ascen.ascension}→{ascen.ascension + 1}
          </div>
          <div className="flex justify-center items-center">
            <SimpleRarityBox
              img={getUrl(`/materials/mora.png`, 64, 64)}
              name={ascen.cost.toString()}
              rarity={1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">Mora</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={getUrl(`/jewels_materials/${ascen.mat1.id}.png`, 64, 64)}
              name={ascen.mat1.amount.toString()}
              rarity={ascen.mat1.rarity}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">{ascen.mat1.name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            {ascen.mat2 && (
              <>
                <SimpleRarityBox
                  img={getUrl(
                    `/elemental_stone_materials/${ascen.mat2.id}.png`,
                    64,
                    64
                  )}
                  name={ascen.mat2.amount.toString()}
                  rarity={ascen.mat2.rarity || 1}
                  className="w-16 h-16"
                />
                <p className="hidden lg:block">{ascen.mat2.name}</p>
              </>
            )}
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={getUrl(`/local_materials/${ascen.mat3.id}.png`, 64, 64)}
              name={ascen.mat3.amount.toString()}
              rarity={ascen.mat3.rarity || 1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">{ascen.mat3.name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={getUrl(`/common_materials/${ascen.mat4.id}.png`, 64, 64)}
              name={ascen.mat4.amount.toString()}
              rarity={ascen.mat4.rarity || 1}
              className="w-16 h-16"
            />
            <p className="hidden lg:block">{ascen.mat4.name}</p>
          </div>
        </div>
      ))}
      <div className="grid grid-cols-7 lg:grid-cols-11 items-center px-4 py-5 bg-vulcan-700 rounded-b">
        <div className="flex justify-center items-center text-sm lg:text-base font-bold">
          TOTAL
        </div>
        <div className="flex justify-center items-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            name={ascensionTotal.cost.toString()}
            rarity={1}
            className="w-16 h-16"
          />
        </div>
        {ascensionTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/${item.type}/${item.id}.png`, 64, 64)}
              name={item.amount.toString()}
              rarity={item.rarity}
              className="w-16 h-16"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(CharacterAscencionMaterials);
