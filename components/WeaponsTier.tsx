import { Weapon } from "genshin-data";
import { Roles, TierlistWeapons, TierNums } from "interfaces/tierlist";
import { IMGS_CDN } from "@lib/constants";
import SimpleRarityBox from "./SimpleRarityBox";

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
  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 w-full">
      <div className="p-5 bg bg-vulcan-900 bg-opacity-50">
        <h3 className="text-2xl text-white text-center font-bold">T{tier}</h3>
      </div>
      {(!selectedCol || selectedCol === Roles.maindps) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.maindps[tier].map((t) => (
            <div key={t} className="inline-block">
              <SimpleRarityBox
                img={`${IMGS_CDN}/weapons/${t}.png`}
                rarity={weaponsMap[t].rarity}
                name={weaponsMap[t].name}
                className="h-24 w-24"
              />
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.subdps) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.subdps[tier].map((t) => (
            <div key={t} className="inline-block">
              <SimpleRarityBox
                img={`${IMGS_CDN}/weapons/${t}.png`}
                rarity={weaponsMap[t].rarity}
                name={weaponsMap[t].name}
                className="h-24 w-24"
              />
            </div>
          ))}
        </div>
      )}
      {(!selectedCol || selectedCol === Roles.support) && (
        <div className="col-span-3 lg:col-span-2 p-5 border border-l-0 border-r-0 border-vulcan-900 bg-vulcan-800 text-center">
          {tierlist.support[tier].map((t) => (
            <div key={t} className="inline-block relative">
              <SimpleRarityBox
                img={`${IMGS_CDN}/weapons/${t}.png`}
                rarity={weaponsMap[t].rarity}
                name={weaponsMap[t].name}
                className="h-24 w-24"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeaponsTier;
