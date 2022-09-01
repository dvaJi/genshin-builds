import Link from "next/link";
import { Weapon } from "genshin-data";

import { Roles, TierlistWeapons, TierNums } from "interfaces/tierlist";
import SimpleRarityBox from "./SimpleRarityBox";
import { getUrl } from "@lib/imgUrl";

interface WeaponsTierProps {
  tierlist: TierlistWeapons;
  tier: TierNums;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  selectedCol: Roles | null;
}

const WeaponsTier = ({
  tierlist,
  tier,
  weaponsMap,
  selectedCol,
}: WeaponsTierProps) => {
  const blockStyle =
    "col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center flex flex-wrap justify-center content-start";
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 w-full">
      <div className="p-5 bg bg-vulcan-900 bg-opacity-50">
        <h3 className="text-2xl text-white text-center font-bold">T{tier}</h3>
      </div>
      {(!selectedCol || selectedCol === Roles.maindps) && (
        <div className={blockStyle}>
          {tierlist.maindps[tier].map((t) => (
            <div key={t} className="inline-block">
              <Link key={t} href={`/weapon/${t}`}>
                <a>
                  <SimpleRarityBox
                    img={getUrl(`/weapons/${t}.png`, 96, 96)}
                    rarity={weaponsMap[t]?.rarity}
                    name={weaponsMap[t]?.name}
                    className="h-24 w-24"
                    nameSeparateBlock={true}
                    classNameBlock="w-24"
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.subdps) && (
        <div className={blockStyle}>
          {tierlist.subdps[tier].map((t) => (
            <div key={t} className="inline-block">
              <Link key={t} href={`/weapon/${t}`}>
                <a>
                  <SimpleRarityBox
                    img={getUrl(`/weapons/${t}.png`, 96, 96)}
                    rarity={weaponsMap[t].rarity}
                    name={weaponsMap[t].name}
                    className="h-24 w-24"
                    nameSeparateBlock={true}
                    classNameBlock="w-24"
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.support) && (
        <div className={blockStyle}>
          {tierlist.support[tier].map((t) => (
            <div key={t} className="inline-block relative">
              <Link key={t} href={`/weapon/${t}`}>
                <a>
                  <SimpleRarityBox
                    img={getUrl(`/weapons/${t}.png`, 96, 96)}
                    rarity={weaponsMap[t].rarity}
                    name={weaponsMap[t].name}
                    className="h-24 w-24"
                    nameSeparateBlock={true}
                    classNameBlock="w-24"
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

export default WeaponsTier;
