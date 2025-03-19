"use client";

import clsx from "clsx";
import { Roles, TierNums, Tierlist } from "interfaces/tierlist";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";

import CharactersTier from "@components/genshin/CharactersTier";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";

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
  const t = useTranslations("Genshin.tierlist");

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
            selectedList.id !== "tierlist" ? "opacity-50" : "text-white",
          )}
          onClick={() => {
            trackClick(`tierlist_original`);
            setSelectedList({ data: tierlist, id: "tierlist" });
          }}
        >
          {t("tierlist")}
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
            selectedList.id !== "tierlistCZero" ? "opacity-50" : "text-white",
          )}
          onClick={() => {
            trackClick(`tierlist_c0`);
            setSelectedList({ data: tierlistCZero, id: "tierlistCZero" });
          }}
        >
          {t("zero_constellation")}
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
            selectedList.id !== "tierlistCSix" ? "opacity-50" : "text-white",
          )}
          onClick={() => {
            trackClick(`tierlist_c6`);
            setSelectedList({ data: tierlistCSix, id: "tierlistCSix" });
          }}
        >
          {t("six_constellation")}
        </button>
      </div>
      <div className="mb-6 grid w-full grid-cols-8 gap-4">
        <div />
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.maindps ? "opacity-50 lg:opacity-100" : "",
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.maindps}`);
            changeTierTab(Roles.maindps);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t("main_dps")}
          </h3>
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.subdps ? "opacity-50 lg:opacity-100" : "",
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.subdps}`);
            changeTierTab(Roles.subdps);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t("sub_dps")}
          </h3>
        </button>
        <button
          className={clsx(
            "col-span-2 rounded-xl bg-vulcan-800 p-5",
            "pointer-events-auto lg:pointer-events-none",
            selectedCol !== Roles.support ? "opacity-50 lg:opacity-100" : "",
          )}
          onClick={() => {
            trackClick(`tierlist_${Roles.support}`);
            changeTierTab(Roles.support);
          }}
        >
          <h3 className="text-center text-lg font-semibold text-white">
            {t("support")}
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
