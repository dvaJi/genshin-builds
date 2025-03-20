import clsx from "clsx";
import { Roles, TierNums, Tierlist } from "interfaces/tierlist";
import { memo } from "react";

import { Link } from "@i18n/navigation";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { capitalize } from "@utils/capitalize";

import CharacterPortrait from "./CharacterPortrait";

interface CharactersTierProps {
  tierlist: Tierlist;
  tier: TierNums;
  characters: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  artifactsMap: Record<string, Pick<Artifact, "id" | "name">>;
  selectedCol: Roles | null;
}

const CharactersTier = ({
  tierlist,
  tier,
  characters,
  weaponsMap,
  artifactsMap,
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
          "hidden lg:flex": selectedCol !== Roles.maindps,
        })}
      >
        {tierlist.maindps[tier].map((tier) => (
          <div key={tier.id} className="inline-block">
            <Link href={`/character/${tier.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[tier.id],
                  constellationNum: tier.min_c,
                  element: capitalize(characters[tier.id].element.id),
                }}
                weapon={weaponsMap[tier.w_id]}
                artifacts={tier.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
      <div
        className={clsx(blockStyle, {
          "hidden lg:flex": selectedCol !== Roles.subdps,
        })}
      >
        {tierlist.subdps[tier].map((tier) => (
          <div key={tier.id} className="inline-block">
            <Link href={`/character/${tier.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[tier.id],
                  constellationNum: tier.min_c,
                  element: capitalize(characters[tier.id].element.id),
                }}
                weapon={weaponsMap[tier.w_id]}
                artifacts={tier.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
      <div
        className={clsx(blockStyle, {
          "hidden lg:flex": selectedCol !== Roles.support,
        })}
      >
        {tierlist.support[tier].map((tier) => (
          <div key={tier.id} className="relative inline-block">
            <Link href={`/character/${tier.id}`}>
              <CharacterPortrait
                character={{
                  ...characters[tier.id],
                  constellationNum: tier.min_c,
                  element: capitalize(characters[tier.id].element.id),
                }}
                weapon={weaponsMap[tier.w_id]}
                artifacts={tier.a_ids.map((a) => artifactsMap[a])}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CharactersTier);
