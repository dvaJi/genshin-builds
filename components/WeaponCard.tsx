import { memo } from "react";
import Link from "next/link";
import { Weapon } from "genshin-data";

import StarRarity from "./StarRarity";

import { getUrl } from "@lib/imgUrl";

interface WeaponCardProps {
  weapon: Weapon;
  refinement?: number;
}

const WeaponCard = ({ weapon, refinement }: WeaponCardProps) => {
  return (
    <div className="bg-vulcan-900 border border-vulcan-700 mb-2 rounded flex flex-col">
      <div className="flex flex-row h-full">
        <div
          className="flex flex-none relative bg-cover p-1 rounded rounded-tr-none rounded-br-none items-center justify-center"
          style={{
            backgroundImage: `url(${getUrl(`/bg_${weapon.rarity}star.png`)})`,
          }}
        >
          <img
            src={getUrl(`/weapons/${weapon.id}.png`, 92, 92)}
            height={92}
            width={92}
            alt={weapon.name}
          />
          <div className="absolute bottom-0 bg-gray-900 bg-opacity-50 w-full px-2 py-1 items-center justify-center flex">
            <StarRarity
              starClassname="w-4"
              rarity={weapon.rarity}
              starsSize={42}
            />
          </div>
        </div>
        <div className="ml-3 p-3 relative">
          <Link href={`/weapon/${weapon.id}`}>
            <a>
              <div className="flex">
                <h4 className="font-bold text-white">
                  {weapon.name}{" "}
                  {refinement !== undefined && (
                    <span className="text-xs bg-vulcan-600 p-1 rounded">
                      R{refinement}
                    </span>
                  )}
                </h4>
                <h3 className="text-xs text-gray-300 absolute right-4">
                  {weapon.stats.secondary}
                </h3>
              </div>
              <p
                className="text-sm weapon-bonus max-h-24 overflow-y-auto custom-scroll"
                dangerouslySetInnerHTML={{
                  __html: weapon.bonus || "",
                }}
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(WeaponCard);
