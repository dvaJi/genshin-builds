import type { Weapon } from "@interfaces/genshin";
import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import clsx from "clsx";

interface WeaponCardProps {
  position: number;
  weapon: Weapon;
  refinement?: number;
}

const WeaponCard = ({ position, weapon, refinement }: WeaponCardProps) => {
  const { locale } = useIntl("weapons");
  return (
    <Link
      href={`/${locale}/weapon/${weapon.id}`}
      className="mb-2 flex w-full rounded border border-vulcan-700 bg-vulcan-900 px-4 transition hover:border-vulcan-600 hover:bg-vulcan-800"
    >
      <div className="mr-2 flex items-center">
        <span className="mr-2 rounded bg-vulcan-600 p-1 text-xs text-slate-300">
          {position}
        </span>
      </div>
      <div
        className={clsx(
          "relative my-1 flex flex-none items-center justify-center rounded bg-cover",
          `genshin-bg-rarity-${weapon.rarity}`
        )}
      >
        <LazyLoadImage
          src={getUrl(`/weapons/${weapon.id}.png`, 84, 84)}
          height={64}
          width={64}
          alt={weapon.name}
        />
      </div>
      <div className="ml-4 flex flex-col justify-center">
        <div className="font-bold text-white">
          {weapon.name}{" "}
          {refinement !== undefined && refinement > 0 && (
            <span className="rounded bg-vulcan-600 p-1 text-xxs">
              R{refinement}
              {refinement < 5 ? "+" : ""}
            </span>
          )}
        </div>
        <p className="relative text-xs text-gray-300">
          {weapon.stats.secondary}
        </p>
      </div>
    </Link>
  );
};

export default memo(WeaponCard);
