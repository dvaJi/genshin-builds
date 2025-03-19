import { memo } from "react";

import { cn } from "@app/lib/utils";
import { Link } from "@i18n/navigation";
import type { Weapon } from "@interfaces/genshin";

import Image from "./Image";

interface WeaponCardProps {
  position: number;
  weapon: Weapon;
  refinement?: number;
  locale: string;
}

const WeaponCard = ({ position, weapon, refinement }: WeaponCardProps) => {
  if (!weapon) return null;
  return (
    <Link
      href={`/weapon/${weapon.id}`}
      className="mb-2 flex w-full rounded-md border border-border px-2 transition-all hover:bg-card hover:shadow-md sm:px-4"
    >
      <div className="mr-1 flex items-center sm:mr-2">
        <span className="mr-1 rounded bg-muted p-1 text-xs text-muted-foreground sm:mr-2">
          {position}
        </span>
      </div>
      <div
        className={cn(
          "relative my-1 flex flex-none items-center justify-center rounded bg-cover",
          `genshin-bg-rarity-${weapon.rarity}`,
        )}
      >
        <Image
          src={`/weapons/${weapon.id}.png`}
          height={64}
          width={64}
          alt={weapon.name}
          className="h-12 w-12 sm:h-16 sm:w-16"
        />
      </div>
      <div className="ml-2 flex flex-col justify-center sm:ml-4">
        <div className="text-sm font-bold text-card-foreground sm:text-base">
          {weapon.name}{" "}
          {refinement !== undefined && refinement > 0 && (
            <span className="ml-1 rounded bg-muted px-[4px] py-[2px] text-xxs">
              R{refinement}
              {refinement < 5 ? "+" : ""}
            </span>
          )}
        </div>
        <p className="relative text-xs text-muted-foreground">
          {weapon.stats.secondary}
        </p>
      </div>
    </Link>
  );
};

export default memo(WeaponCard);
