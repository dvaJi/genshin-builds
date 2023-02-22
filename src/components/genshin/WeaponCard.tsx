import { memo } from "react";
import type { Weapon } from "genshin-data";
import Link from "@/components/ui/Link";
import { getUrl } from "@/lib/img";

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
          <img
            src={getUrl(`/weapons/${weapon.id}.png`, 92, 92)}
            height={92}
            width={92}
            alt={weapon.name}
          />
          <div className="absolute bottom-0 flex w-full items-center justify-center bg-gray-900 bg-opacity-50 px-2 py-1">
            {Array.from({ length: weapon.rarity }, (_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#facc15"
                className="h-3 w-3 fill-yellow-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
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
