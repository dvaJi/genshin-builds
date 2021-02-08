import { memo } from "react";
import Image from "next/image";
import { Weapon } from "genshin-data";

import StarRarity from "./StarRarity";

interface WeaponCardProps {
  weapon: Weapon;
}

const WeaponCard = ({ weapon }: WeaponCardProps) => {
  return (
    <div className="bg-gray-800 border border-gray-900 mb-2 rounded p-3 flex flex-col">
      <div className="flex items-center relative mb-3">
        <div className="mr-3">
          <Image
            src={`/_assets/weapons/${weapon.id}.png`}
            height={60}
            width={60}
            alt={weapon.name}
          />
        </div>
        <StarRarity className="absolute left-3 top-14" rarity={weapon.rarity} />
        <div>
          <h4 className="font-bold text-white">{weapon.name}</h4>
          <div className="text-white text-sm">{weapon.secondary}</div>
        </div>
      </div>
      <div>
        <p
          dangerouslySetInnerHTML={{
            __html: weapon.bonus || "",
          }}
        />
      </div>
    </div>
  );
};

export default memo(WeaponCard);
