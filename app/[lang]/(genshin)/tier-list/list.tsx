"use client";

import type { Artifact, Character, Weapon } from "genshin-data";
import dynamic from "next/dynamic";
import { useState } from "react";

import CharactersTier from "@components/genshin/CharactersTier";
import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import clsx from "clsx";
import { Roles, TierNums, Tierlist } from "interfaces/tierlist";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  tierlist: Tierlist;
  tierlistCZero: Tierlist;
  tierlistCSix: Tierlist;
  charactersMap: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  artifactsMap: Record<string, Pick<Artifact, "id" | "name">>;
};

export default function GenshinTierlistView({
  tierlist,
  tierlistCZero,
  tierlistCSix,
  charactersMap,
  weaponsMap,
  artifactsMap,
}: Props) {
  const [selectedCol, setSelectedCol] = useState<Roles | null>(Roles.maindps);
  const [selectedList, setSelectedList] = useState({
    data: tierlist,
    id: "tierlist",
  });
  const { t } = useIntl("tierlist");

  const changeTierTab = (role: Roles) => {
    setSelectedCol(role);
  };

  return (
    <div className="rounded">
      <div className="mb-6 grid w-full grid-cols-8 gap-4">
        <div />
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
            selectedList.id !== "tierlist" ? "opacity-50" : "text-white"
          )}
          onClick={() => {
            trackClick(`tierlist_original`);
            setSelectedList({ data: tierlist, id: "tierlist" });
          }}
        >
          {t({ id: "tierlist", defaultMessage: "Tierlist" })}
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
            selectedList.id !== "tierlistCZero" ? "opacity-50" : "text-white"
          )}
          onClick={() => {
            trackClick(`tierlist_c0`);
            setSelectedList({ data: tierlistCZero, id: "tierlistCZero" });
          }}
        >
          {t({ id: "zero_constellation", defaultMessage: "C0 Tierlist" })}
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
            selectedList.id !== "tierlistCSix" ? "opacity-50" : "text-white"
          )}
          onClick={() => {
            trackClick(`tierlist_c6`);
            setSelectedList({ data: tierlistCSix, id: "tierlistCSix" });
          }}
        >
          {t({ id: "six_constellation", defaultMessage: "C6 Tierlist" })}
        </button>
      </div>
      <div className="mb-6 grid w-full grid-cols-8 gap-4">
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
        <CharactersTier
          key={`tier_${key}`}
          tierlist={selectedList.data}
          characters={charactersMap}
          weaponsMap={weaponsMap}
          artifactsMap={artifactsMap}
          tier={key as TierNums}
          selectedCol={selectedCol}
        />
      ))}
    </div>
  );
}
