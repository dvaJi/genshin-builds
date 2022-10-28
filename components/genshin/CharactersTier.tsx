import { memo } from "react";
import CharacterPortrait from "./CharacterPortrait";
import { Character, Weapon } from "genshin-data";
import Link from "next/link";
import { Roles, Tierlist, TierNums } from "interfaces/tierlist";

interface CharactersTierProps {
  tierlist: Tierlist;
  tier: TierNums;
  characters: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  common: Record<string, string>;
  selectedCol: Roles | null;
}

const CharactersTier = ({
  tierlist,
  tier,
  characters,
  weaponsMap,
  common,
  selectedCol,
}: CharactersTierProps) => {
  const blockStyle =
    "col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center flex flex-wrap justify-center content-start";
  return (
    <div className="grid w-full grid-cols-4 gap-4 lg:grid-cols-8">
      <div className="bg bg-vulcan-900 bg-opacity-50 p-5">
        <h3 className="text-center text-2xl font-bold text-white">T{tier}</h3>
      </div>
      {(!selectedCol || selectedCol === Roles.maindps) && (
        <div className={blockStyle}>
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
                />
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.subdps) && (
        <div className={blockStyle}>
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
                />
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.support) && (
        <div className={blockStyle}>
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
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CharactersTier);
