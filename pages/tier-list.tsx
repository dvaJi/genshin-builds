import { useState } from "react";
import { GetStaticProps } from "next";
import clsx from "clsx";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";

import Ads from "@components/ui/Ads";
import CharactersTier from "@components/genshin/CharactersTier";
import Metadata from "@components/Metadata";

import { getLocale } from "@lib/localData";
import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { Roles, Tierlist, TierNums } from "interfaces/tierlist";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrlLQ } from "@lib/imgUrl";

type Props = {
  tierlist: Tierlist;
  tierlistCZero: Tierlist;
  tierlistCSix: Tierlist;
  charactersMap: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  artifactsMap: Record<string, Pick<Artifact, "id" | "name">>;
  common: Record<string, string>;
};

const TierList = ({
  tierlist,
  tierlistCZero,
  tierlistCSix,
  charactersMap,
  weaponsMap,
  artifactsMap,
  common,
}: Props) => {
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
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Tier List (Best Characters)",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <h2 className="my-6 text-center text-2xl font-semibold text-gray-200 lg:text-left">
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Best Characters Tier List",
        })}
      </h2>
      <div className="rounded">
        <div className="mb-6 grid w-full grid-cols-8 gap-4">
          <div />
          <button
            className={clsx(
              "col-span-2 rounded-xl bg-vulcan-800 p-5 hover:bg-vulcan-700",
              selectedList.id !== "tierlist"
                ? "opacity-50 md:opacity-100"
                : "text-white"
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
              selectedList.id !== "tierlistCZero"
                ? "opacity-50 md:opacity-100"
                : "text-white"
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
              selectedList.id !== "tierlistCSix"
                ? "opacity-50 md:opacity-100"
                : "text-white"
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
              "pointer-events-auto md:pointer-events-none",
              selectedCol !== Roles.maindps ? "opacity-50 md:opacity-100" : ""
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
              "pointer-events-auto md:pointer-events-none",
              selectedCol !== Roles.subdps ? "opacity-50 md:opacity-100" : ""
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
              "pointer-events-auto md:pointer-events-none",
              selectedCol !== Roles.support ? "opacity-50 md:opacity-100" : ""
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
        <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
        {["0", "1", "2", "3", "4"].map((key) => (
          <CharactersTier
            key={`tier_${key}`}
            tierlist={selectedList.data}
            characters={charactersMap}
            weaponsMap={weaponsMap}
            artifactsMap={artifactsMap}
            tier={key as TierNums}
            common={common}
            selectedCol={selectedCol}
          />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const artifacts = await genshinData.artifacts({
    select: ["id", "name"],
  });
  const { default: tierlist = {} }: any = await import(
    `../_content/genshin/data/tierlist.json`
  );
  const common = require(`../_content/genshin/data/common.json`)[locale];

  const tiers = ["0", "1", "2", "3", "4"];

  const mergeTiers = (col: any) => {
    let data: any[] = [];
    tiers.forEach((k) => {
      data = [...data, ...col[k]];
    });

    return data;
  };

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const mergedTierlist = [
    ...mergeTiers(tierlist.tierlist.maindps),
    ...mergeTiers(tierlist.tierlist.subdps),
    ...mergeTiers(tierlist.tierlist.support),

    ...mergeTiers(tierlist["tierlist_c0"].maindps),
    ...mergeTiers(tierlist["tierlist_c0"].subdps),
    ...mergeTiers(tierlist["tierlist_c0"].support),

    ...mergeTiers(tierlist["tierlist_c6"].maindps),
    ...mergeTiers(tierlist["tierlist_c6"].subdps),
    ...mergeTiers(tierlist["tierlist_c6"].support),
  ];

  for (const tl of mergedTierlist) {
    charactersMap[tl.id] = characters.find((c) => c.id === tl.id);
    weaponsMap[tl.w_id] = weapons.find((w) => w.id === tl.w_id);
    tl.a_ids.forEach((a_id: string) => {
      artifactsMap[a_id] = artifacts.find((a) => a.id === a_id);
    });
  }

  return {
    props: {
      tierlist: tierlist.tierlist,
      tierlistCZero: tierlist["tierlist_c0"],
      tierlistCSix: tierlist["tierlist_c6"],
      charactersMap,
      weaponsMap,
      artifactsMap,
      lngDict,
      common,
      bgStyle: {
        image: getUrlLQ(`/regions/Sumeru_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default TierList;
