import clsx from "clsx";
import Link from "next/link";

import Image from "@components/wuthering-waves/Image";
import type { Weapons } from "@interfaces/wuthering-waves/weapons";

type Props = {
  tier: string;
  weapons: string[];
  weaponsMap: Record<string, Weapons>;
  lang: string;
};

export default function Tier({ tier, weapons, weaponsMap, lang }: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-ww-950/50 pb-4 last:border-b-0">
      <h3
        className={clsx("w-20 shrink-0 text-center text-2xl", {
          "text-red-500": tier === "SS",
          "text-yellow-500": tier === "S",
          "text-green-500": tier === "A",
          "text-blue-500": tier === "B",
          "text-gray-500": tier === "C",
        })}
      >
        {tier}
      </h3>
      <div className="flex flex-wrap gap-4">
        {weapons.map((char: string) => (
          <Link
            key={char}
            href={`/${lang}/wuthering-waves/weapons/${char}`}
            className="group flex flex-col items-center justify-center gap-2"
          >
            {weaponsMap[char] ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  className={clsx(
                    `overflow-hidden rounded transition-all rarity-${weaponsMap[char].rarity} ring-0 ring-ww-800 group-hover:ring-4`
                  )}
                >
                  <Image
                    className="transition-transform ease-in-out group-hover:scale-110"
                    src={`/weapons/${weaponsMap[char]?.icon?.split("/")?.pop()}.webp`}
                    alt={weaponsMap[char].name}
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="w-24 truncate text-center text-sm text-ww-100 group-hover:text-white">
                  {weaponsMap[char].name}
                </h3>
              </div>
            ) : (
              char
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
