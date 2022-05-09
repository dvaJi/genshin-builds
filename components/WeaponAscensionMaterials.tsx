import clsx from "clsx";
import { useCallback, memo, useMemo } from "react";
import { WeaponAscension } from "genshin-data/dist/types/weapon";

import SimpleRarityBox from "./SimpleRarityBox";
import { getUrl } from "@lib/imgUrl";
import { calculateTotalWeaponAscensionMaterials } from "@utils/totals";

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
              "grid grid-cols-6 lg:grid-cols-10 items-center px-4",
              {
                "bg-vulcan-700": i % 2 === 0,
                "rounded rounded-b-none": i === 0,
              }
            )}
          >
            <div className="flex justify-center items-center text-sm lg:text-base">
              Ascension {ascen.ascension}
            </div>
            <div className="flex justify-center items-center text-sm lg:text-base">
              [{ascension[i].level}/{ascen.level}]
            </div>
            <div className="flex justify-center items-center">
              <SimpleRarityBox
                img={getUrl(`/materials/mora.png`, 64, 64)}
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
                  img={getUrl(`/${getFolder(i)}/${mat.id}.png`, 64, 64)}
                  name={mat.amount.toString()}
                  rarity={mat.rarity}
                  className="w-16 h-16"
                />
                <p className="hidden lg:block">{mat.name}</p>
              </div>
            ))}
          </div>
        ))}
      <div className="grid grid-cols-6 lg:grid-cols-12 items-center px-4 py-5 rounded-b bg-vulcan-700">
        <div className="flex justify-center items-center text-sm lg:text-base font-bold">
          TOTAL
        </div>
        <div className="flex justify-center items-center">
          <SimpleRarityBox
            img={getUrl(`/materials/mora.png`, 64, 64)}
            name={talentsTotal.cost.toString()}
            rarity={1}
            className="w-16 h-16"
          />
        </div>
        {talentsTotal.items.map((item) => (
          <div key={item.id} className="flex items-center">
            <SimpleRarityBox
              img={getUrl(`/${item.type}/${item.id}.png`, 64, 64)}
              name={item.amount.toString()}
              rarity={item.rarity || 1}
              className="w-16 h-16"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default memo(WeaponAscensionMaterials);
