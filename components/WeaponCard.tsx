import { memo } from "react";
import { Weapon } from "genshin-data";

import StarRarity from "./StarRarity";
import { IMGS_CDN } from "@lib/constants";

interface WeaponCardProps {
  weapon: Weapon;
}

const WeaponCard = ({ weapon }: WeaponCardProps) => {
  return (
    <div className="bg-vulcan-900 border border-vulcan-700 mb-2 rounded flex flex-col">
      <div className="flex flex-row h-full">
        <div
          className="flex flex-none relative bg-cover p-1 rounded rounded-tr-none rounded-br-none items-center justify-center"
          style={{
            backgroundImage: `url(${IMGS_CDN}/bg_${weapon.rarity}star.png)`,
          }}
        >
          <img
            src={`${IMGS_CDN}/weapons/${weapon.id}.png`}
            height={92}
            width={92}
            alt={weapon.name}
          />
          <div className="absolute bottom-0 bg-gray-900 bg-opacity-50 w-full px-2 py-0.5 items-center justify-center flex">
            <StarRarity
              starClassname="w-4"
              rarity={weapon.rarity}
              starsSize={42}
            />
          </div>
        </div>
        <div className="ml-3 p-3">
          <div className="flex">
            <h4 className="font-bold text-white">{weapon.name}</h4>
          </div>
          <p
            className="text-sm weapon-bonus"
            dangerouslySetInnerHTML={{
              __html: weapon.bonus || "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(WeaponCard);
