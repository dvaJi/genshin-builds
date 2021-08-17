import { memo } from "react";
import clsx from "clsx";
import SimpleRarityBox from "./SimpleRarityBox";
import { IMGS_CDN } from "@lib/constants";
import { useCallback } from "react";
import { WeaponAscension } from "genshin-data/dist/types/weapon";

type Props = {
  ascension: WeaponAscension[];
};

const WeaponAscensionMaterials = ({ ascension }: Props) => {
  const getFolder = useCallback((index: number) => {
    if (index === 0) {
      return "weapon_primary_materials";
    }

    if (index === 1) {
      return "weapon_secondary_materials";
    }

    if (index === 2) {
      return "common_materials";
    }

    return "weapon_primary_materials";
  }, []);

  return (
    <>
      {ascension
        .filter((ascen) => ascen.materials.length > 0)
        .map((ascen, i) => (
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
              ascension {ascen.ascension}
            </div>
            <div className="flex justify-center items-center text-sm lg:text-base">
              [{ascension[i].level}/{ascen.level}]
            </div>
            <div className="flex justify-center items-center">
              <SimpleRarityBox
                img={`${IMGS_CDN}/materials/mora.png`}
                name={ascen.cost?.toString()}
                rarity={1}
                className="w-16 h-16"
              />
              <p className="hidden lg:block">Mora</p>
            </div>
            {ascen.materials.map((mat, i) => (
              <div
                key={mat.id + mat.amount}
                className="lg:col-span-2 flex items-center"
              >
                <SimpleRarityBox
                  img={`${IMGS_CDN}/${getFolder(i)}/${mat.id}.png`}
                  name={mat.amount.toString()}
                  rarity={mat.rarity}
                  className="w-16 h-16"
                />
                <p className="hidden lg:block">{mat.name}</p>
              </div>
            ))}
          </div>
        ))}
    </>
  );
};

export default memo(WeaponAscensionMaterials);
