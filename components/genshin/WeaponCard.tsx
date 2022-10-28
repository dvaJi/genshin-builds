import { memo } from "react";
import Link from "next/link";
import { Weapon } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import StarRarity from "../StarRarity";

import { getUrl } from "@lib/imgUrl";

interface WeaponCardProps {
  weapon: Weapon;
  refinement?: number;
}

const WeaponCard = ({ weapon, refinement }: WeaponCardProps) => {
  return (
    <div className="mb-2 flex flex-col rounded border border-vulcan-700 bg-vulcan-900 transition hover:border-vulcan-600 hover:bg-vulcan-800">
      <div className="flex h-full flex-row">
        <div
          className="relative flex flex-none items-center justify-center rounded rounded-tr-none rounded-br-none bg-cover p-1"
          style={{
            backgroundImage: `url(${getUrl(`/bg_${weapon.rarity}star.png`)})`,
          }}
        >
          <LazyLoadImage
            src={getUrl(`/weapons/${weapon.id}.png`, 92, 92)}
            height={92}
            width={92}
            alt={weapon.name}
          />
          <div className="absolute bottom-0 flex w-full items-center justify-center bg-gray-900 bg-opacity-50 px-2 py-1">
            <StarRarity
              starClassname="w-4"
              rarity={weapon.rarity}
              starsSize={42}
            />
          </div>
        </div>
        <div className="relative ml-3 p-3">
          <Link href={`/weapon/${weapon.id}`}>
            <div className="flex items-center">
              <h4 className="font-bold text-white">
                {weapon.name}{" "}
                {refinement !== undefined && (
                  <span className="rounded bg-vulcan-600 p-1 text-xs">
                    R{refinement}
                  </span>
                )}
              </h4>
              <h3 className="relative ml-2 text-xs text-gray-300 sm:absolute sm:right-4 sm:ml-0">
                {weapon.stats.secondary}
              </h3>
            </div>
            <p
              className="weapon-bonus custom-scroll max-h-24 overflow-y-auto text-sm"
              dangerouslySetInnerHTML={{
                __html: weapon.bonus || "",
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(WeaponCard);
