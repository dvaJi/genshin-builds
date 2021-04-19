import { memo } from "react";
import {
  CommonMaterial,
  ElementalStoneMaterial,
  JewelMaterial,
  LocalMaterial,
} from "genshin-data";
import { Ascension } from "genshin-data/dist/types/character";
import clsx from "clsx";
import SimpleRarityBox from "./SimpleRarityBox";
import { IMGS_CDN } from "@lib/constants";

type Props = {
  ascension: Ascension[];
  materials: Record<
    string,
    CommonMaterial | ElementalStoneMaterial | LocalMaterial | JewelMaterial
  >;
};

const CharacterAscencionMaterials = ({ ascension, materials }: Props) => {
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
              img={`${IMGS_CDN}/materials/mora.png`}
              name={ascen.cost.toString()}
              rarity={1}
              size={16}
            />
            <p className="hidden lg:block">Mora</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={`${IMGS_CDN}/jewels_materials/${ascen.mat1.id}.png`}
              name={ascen.mat1.amount.toString()}
              rarity={materials[ascen.mat1.id].rarity || 1}
              size={16}
            />
            <p className="hidden lg:block">{ascen.mat1.name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            {ascen.mat2 && (
              <>
                <SimpleRarityBox
                  img={`${IMGS_CDN}/elemental_stone_materials/${ascen.mat2.id}.png`}
                  name={ascen.mat2.amount.toString()}
                  rarity={materials[ascen.mat2.id].rarity || 1}
                  size={16}
                />
                <p className="hidden lg:block">{ascen.mat2.name}</p>
              </>
            )}
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={`${IMGS_CDN}/local_materials/${ascen.mat3.id}.png`}
              name={ascen.mat3.amount.toString()}
              rarity={materials[ascen.mat3.id].rarity || 1}
              size={16}
            />
            <p className="hidden lg:block">{ascen.mat3.name}</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <SimpleRarityBox
              img={`${IMGS_CDN}/common_materials/${ascen.mat4.id}.png`}
              name={ascen.mat4.amount.toString()}
              rarity={materials[ascen.mat4.id].rarity || 1}
              size={16}
            />
            <p className="hidden lg:block">{ascen.mat4.name}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(CharacterAscencionMaterials);
