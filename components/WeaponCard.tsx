import { memo } from "react";
import Image from "next/image";
import { Weapon } from "genshin-data";

import StarRarity from "./StarRarity";

interface WeaponCardProps {
  weapon: Weapon;
}

const WeaponCard = ({ weapon }: WeaponCardProps) => {
  return (
    <div className="bg-vulcan-800 border border-vulcan-700 mb-2 rounded p-3 flex flex-col">
      <div className="flex flex-row">
        <div className="flex-none relative">
          <Image
            src={`/_assets/weapons/${weapon.id}.png`}
            height={84}
            width={84}
            alt={weapon.name}
          />
        </div>
        <div className="ml-3">
          <div className="flex">
            <h4 className="font-bold text-white">{weapon.name}</h4>
            <StarRarity className="ml-2" rarity={weapon.rarity} />
          </div>
          <p
            className="text-sm"
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
