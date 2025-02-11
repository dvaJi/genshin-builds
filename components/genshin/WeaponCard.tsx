import clsx from "clsx";
import Link from "next/link";
import { memo } from "react";

import type { Weapon } from "@interfaces/genshin";

import Image from "./Image";

interface WeaponCardProps {
  position: number;
  weapon: Weapon;
  refinement?: number;
  locale: string;
}

const WeaponCard = ({
  position,
  weapon,
  refinement,
  locale,
}: WeaponCardProps) => {
  if (!weapon) return null;
  return (
    <Link
      href={`/${locale}/weapon/${weapon.id}`}
      className="border-border hover:bg-card mb-2 flex w-full rounded-md border px-4 transition-all hover:shadow-md"
      prefetch={false}
    >
      <div className="mr-2 flex items-center">
        <span className="bg-muted text-muted-foreground mr-2 rounded p-1 text-xs">
          {position}
        </span>
      </div>
      <div
        className={clsx(
          "relative my-1 flex flex-none items-center justify-center rounded bg-cover",
          `genshin-bg-rarity-${weapon.rarity}`
        )}
      >
        <Image
          src={`/weapons/${weapon.id}.png`}
          height={64}
          width={64}
          alt={weapon.name}
        />
      </div>
      <div className="ml-4 flex flex-col justify-center">
        <div className="text-card-foreground font-bold">
          {weapon.name}{" "}
          {refinement !== undefined && refinement > 0 && (
            <span className="bg-muted ml-1 rounded px-[4px] py-[2px] text-xxs">
              R{refinement}
              {refinement < 5 ? "+" : ""}
            </span>
          )}
        </div>
        <p className="text-muted-foreground relative text-xs">
          {weapon.stats.secondary}
        </p>
      </div>
    </Link>
  );
};

export default memo(WeaponCard);
