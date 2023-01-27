import clsx from "clsx";
import { memo } from "react";
import Link from "next/link";
import { Artifact, Character, Weapon } from "genshin-data";

import CharacterPortrait from "./CharacterPortrait";
import { Roles, Tierlist, TierNums } from "interfaces/tierlist";

interface CharactersTierProps {
  tierlist: Tierlist;
  tier: TierNums;
  characters: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  artifactsMap: Record<string, Pick<Artifact, "id" | "name">>;
  common: Record<string, string>;
  selectedCol: Roles | null;
}

const CharactersTier = ({
  tierlist,
  tier,
  characters,
  weaponsMap,
  artifactsMap,
  common,
  selectedCol,
}: CharactersTierProps) => {
  let tierText = "SS";

  switch (tier) {
    case "0":
      tierText = "SS";
      break;
    case "1":
      tierText = "S";
      break;
    case "2":
      tierText = "A";
      break;
    case "3":
      tierText = "B";
      break;
    case "4":
      tierText = "C";
      break;
  }

  const blockStyle =
    "col-span-4 lg:col-span-2 p-2 md:p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center flex flex-wrap justify-center content-start";
  return (
    <div className="grid w-full grid-cols-5 gap-0 md:gap-4 lg:grid-cols-8">
      <div
        className={clsx("flex items-center justify-center", {
          "bg-red-400/90": tier === "0",
          "bg-orange-400/90": tier === "1",
          "bg-yellow-400/90": tier === "2",
          "bg-green-400/90": tier === "3",
          "bg-blue-400/90": tier === "4",
        })}
      >
        <h3 className="text-center text-2xl font-bold text-white shadow-black text-shadow">
          {tierText}
        </h3>
      </div>
      <div
        className={clsx(blockStyle, {
          "hidden md:block": selectedCol !== Roles.maindps,
        })}
      >
        {tierlist.maindps[tier].map((t) => (
          <div key={t.id} className="inline-block">
            <Link href={`/character/${t.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[t.id],
                  constellationNum: t.min_c,
                  element: common[characters[t.id].element],
                }}
                weapon={weaponsMap[t.w_id]}
                artifacts={t.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
      <div
        className={clsx(blockStyle, {
          "hidden md:block": selectedCol !== Roles.subdps,
        })}
      >
        {tierlist.subdps[tier].map((t) => (
          <div key={t.id} className="inline-block">
            <Link href={`/character/${t.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[t.id],
                  constellationNum: t.min_c,
                  element: common[characters[t.id].element],
                }}
                weapon={weaponsMap[t.w_id]}
                artifacts={t.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
      <div
        className={clsx(blockStyle, {
          "hidden md:block": selectedCol !== Roles.support,
        })}
      >
        {tierlist.support[tier].map((t) => (
          <div key={t.id} className="relative inline-block">
            <Link href={`/character/${t.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[t.id],
                  constellationNum: t.min_c,
                  element: common[characters[t.id].element],
                }}
                weapon={weaponsMap[t.w_id]}
                artifacts={t.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CharactersTier);
