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
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 w-full">
      <div className="p-5 bg bg-vulcan-900 bg-opacity-50">
        <h3 className="text-2xl text-white text-center font-bold">T{tier}</h3>
      </div>
      {(!selectedCol || selectedCol === Roles.maindps) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.maindps[tier].map((t) => (
            <div key={t.id} className="inline-block">
              <Link href={`/character/${t.id}`}>
                <a>
                  <CharacterPortrait
                    character={{
                      ...characters[t.id],
                      constellationNum: t.min_c,
                      element: common[characters[t.id].element],
                    }}
                    weapon={weaponsMap[t.w_id]}
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.subdps) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.subdps[tier].map((t) => (
            <div key={t.id} className="inline-block">
              <Link href={`/character/${t.id}`}>
                <a>
                  <CharacterPortrait
                    character={{
                      ...characters[t.id],
                      constellationNum: t.min_c,
                      element: common[characters[t.id].element],
                    }}
                    weapon={weaponsMap[t.w_id]}
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.support) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.support[tier].map((t) => (
            <div key={t.id} className="inline-block relative">
              <Link href={`/character/${t.id}`}>
                <a>
                  <CharacterPortrait
                    character={{
                      ...characters[t.id],
                      constellationNum: t.min_c,
                      element: common[characters[t.id].element],
                    }}
                    weapon={weaponsMap[t.w_id]}
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CharactersTier);
