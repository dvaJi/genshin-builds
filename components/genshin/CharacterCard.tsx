import Image from "@components/genshin/Image";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { capitalize } from "@utils/capitalize";

import ElementIcon from "./ElementIcon";

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    element: { id: string };
    rarity: number;
    beta?: boolean;
    release: number;
  };
  latestRelease: number;
}

export function CharacterCard({
  character,
  latestRelease,
}: CharacterCardProps) {
  return (
    <Link href={`/character/${character.id}`} className="group/card block">
      <div className="relative">
        <div
          className={cn(
            "relative aspect-square overflow-hidden rounded border transition-colors",
            "border-input/70 group-hover/card:border-input",
            "group-active/card:scale-95",
            `genshin-bg-rarity-${character.rarity}`,
          )}
        >
          <div className="relative h-full w-full">
            <Image
              className={cn(
                "absolute left-1/2 top-1/2 z-20 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-100 transform object-cover will-change-transform",
                "transition-transform duration-300",
                "group-hover/card:scale-110",
              )}
              alt={character.id}
              src={`/characters/${character.id}/image.png`}
              width={512}
              height={512}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              sizes="(max-width: 400px) 25vw, (max-width: 640px) 20vw, (max-width: 768px) 16vw, 12.5vw"
            />
            <ElementIcon
              type={capitalize(character.element.id)}
              height={14}
              width={14}
              className="absolute right-0.5 top-0.5 z-30 rounded-full bg-background/80 p-0.5 shadow-sm sm:h-5 sm:w-5 sm:p-1"
            />

            <div className="absolute bottom-0.5 left-0.5 z-30 flex gap-0.5 sm:gap-1">
              {character.beta && (
                <span className="rounded bg-background/80 px-0.5 py-[1px] text-[7px] font-medium uppercase tracking-wide text-foreground shadow-sm sm:px-1.5 sm:py-0.5 sm:text-[10px]">
                  Beta
                </span>
              )}
              {latestRelease === character.release && !character.beta && (
                <span className="rounded bg-amber-500/90 px-0.5 py-[1px] text-[7px] font-medium uppercase tracking-wide text-white shadow-sm sm:px-1.5 sm:py-0.5 sm:text-[10px]">
                  New
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-0.5 text-center sm:mt-1.5">
        <h3
          className={cn(
            "line-clamp-1 px-0.5 text-[10px] font-medium text-foreground sm:text-xs",
            "transition-colors duration-200",
            "group-hover/card:text-accent",
          )}
        >
          {character.name}
        </h3>
      </div>
    </Link>
  );
}
