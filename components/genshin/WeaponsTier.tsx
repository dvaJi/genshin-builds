import { Weapon } from "genshin-data";
import Link from "next/link";

import { getUrl } from "@lib/imgUrl";
import clsx from "clsx";
import { Roles, TierlistWeapons, TierNums } from "interfaces/tierlist";
import SimpleRarityBox from "../SimpleRarityBox";

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
    <div className="grid w-full grid-cols-4 gap-4 lg:grid-cols-8">
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
        {tierlist.maindps[tier].map((t) => (
          <div key={t} className="inline-block">
            <Link key={t} href={`/weapon/${t}`}>
              <SimpleRarityBox
                img={getUrl(`/weapons/${t}.png`, 96, 96)}
                rarity={weaponsMap[t]?.rarity}
                name={weaponsMap[t]?.name}
                className="h-24 w-24"
                nameSeparateBlock={true}
                classNameBlock="w-24"
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
        {tierlist.subdps[tier].map((t) => (
          <div key={t} className="inline-block">
            <Link key={t} href={`/weapon/${t}`}>
              <SimpleRarityBox
                img={getUrl(`/weapons/${t}.png`, 96, 96)}
                rarity={weaponsMap[t].rarity}
                name={weaponsMap[t].name}
                className="h-24 w-24"
                nameSeparateBlock={true}
                classNameBlock="w-24"
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
        {tierlist.support[tier].map((t) => (
          <div key={t} className="relative inline-block">
            <Link key={t} href={`/weapon/${t}`}>
              <SimpleRarityBox
                img={getUrl(`/weapons/${t}.png`, 96, 96)}
                rarity={weaponsMap[t].rarity}
                name={weaponsMap[t].name}
                className="h-24 w-24"
                nameSeparateBlock={true}
                classNameBlock="w-24"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponsTier;
