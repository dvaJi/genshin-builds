"use client";

import type { Weapon } from "@interfaces/genshin";
import dynamic from "next/dynamic";
import { useState } from "react";

import WeaponsTier from "@components/genshin/WeaponsTier";
import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";
import clsx from "clsx";
import { Roles, TierNums, TierlistWeapons } from "interfaces/tierlist";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  tierlist: Record<string, TierlistWeapons>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
};

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

export default function GenshinTierlistWeaponsView({
  tierlist,
  weaponsMap,
}: Props) {
  const [typeFilter, setTypeFilter] = useState("sword");
  const [selectedCol, setSelectedCol] = useState<Roles>(Roles.maindps);
  const { t } = useIntl("tierlist_weapons");

  const changeTierTab = (role: Roles) => {
    setSelectedCol(role);
  };

  return (
    <div className="rounded">
      <div className="my-4 text-center">
        {weaponTypes.map((type) => (
          <button
            key={type}
            className={clsx(
              "mr-1 rounded border hover:border-gray-700 hover:bg-vulcan-800",
              type.toLowerCase() === typeFilter
                ? "border-gray-700 bg-vulcan-800"
                : "border-gray-800"
            )}
            onClick={() => {
              trackClick(`tierlist_${type}`);
              if (type === typeFilter) {
                setTypeFilter("");
              } else {
                setTypeFilter(type.toLowerCase());
              }
            }}
          >
            <img
              className="h-16 w-16"
              alt={type}
              src={getUrl(`/weapons_type/${type}.png`, 64, 64)}
            />
          </button>
        ))}
      </div>
      <div className="grid w-full grid-cols-8 gap-4">
        <div />
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.maindps ? "opacity-50 lg:opacity-100" : ""
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.maindps}`);
            changeTierTab(Roles.maindps);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t({ id: "main_dps", defaultMessage: "Main DPS" })}
          </h3>
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.subdps ? "opacity-50 lg:opacity-100" : ""
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.subdps}`);
            changeTierTab(Roles.subdps);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t({ id: "sub_dps", defaultMessage: "Sub DPS" })}
          </h3>
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.support ? "opacity-50 lg:opacity-100" : ""
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.support}`);
            changeTierTab(Roles.support);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t({ id: "support", defaultMessage: "Support" })}
          </h3>
        </button>
      </div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      {["0", "1", "2", "3", "4"].map((key) => (
        <WeaponsTier
          key={`${typeFilter}_${key}`}
          tierlist={tierlist[typeFilter]}
          weaponsMap={weaponsMap}
          tier={key as TierNums}
          selectedCol={selectedCol}
        />
      ))}
    </div>
  );
}
