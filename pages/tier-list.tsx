import { useState } from "react";
import { GetStaticProps } from "next";
import clsx from "clsx";
import GenshinData, { Character, Weapon } from "genshin-data";

import Ads from "@components/ui/Ads";
import CharactersTier from "@components/genshin/CharactersTier";
import Metadata from "@components/Metadata";

import { getLocale } from "@lib/localData";
import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { Roles, Tierlist, TierNums } from "interfaces/tierlist";
import { useMobileDetect } from "@hooks/use-mobile-detect";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrlLQ } from "@lib/imgUrl";

type Props = {
  tierlist: Tierlist;
  charactersMap: Record<string, Pick<Character, "id" | "name" | "element">>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
  common: Record<string, string>;
};

const TierList = ({ tierlist, charactersMap, weaponsMap, common }: Props) => {
  const { isMobile } = useMobileDetect();
  const [selectedCol, setSelectedCol] = useState<Roles | null>(
    isMobile ? Roles.maindps : null
  );
  const { t } = useIntl("tierlist");

  const changeTierTab = (role: Roles) => {
    if (isMobile) {
      setSelectedCol(role);
    } else {
      setSelectedCol(null);
    }
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
      <h2 className="text-center lg:text-left my-6 text-2xl font-semibold text-gray-200">
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Best Characters Tier List",
        })}
      </h2>
      <div className="rounded">
        <div className="grid grid-cols-8 gap-4 w-full">
          <div className="p-5"></div>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.maindps ? "opacity-50" : ""
            )}
            onClick={() => {
              trackClick(`tierlist_${Roles.maindps}`);
              changeTierTab(Roles.maindps);
            }}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              {t({ id: "main_dps", defaultMessage: "Main DPS" })}
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.subdps ? "opacity-50" : ""
            )}
            onClick={() => {
              trackClick(`tierlist_${Roles.subdps}`);
              changeTierTab(Roles.subdps);
            }}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              {t({ id: "sub_dps", defaultMessage: "Sub DPS" })}
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.support ? "opacity-50" : ""
            )}
            onClick={() => {
              trackClick(`tierlist_${Roles.support}`);
              changeTierTab(Roles.support);
            }}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              {t({ id: "support", defaultMessage: "Support" })}
            </h3>
          </button>
        </div>
        <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
        {["0", "1", "2", "3", "4"].map((key) => (
          <CharactersTier
            key={`tier_${key}`}
            tierlist={tierlist}
            characters={charactersMap}
            weaponsMap={weaponsMap}
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
  const mergedTierlist = [
    ...mergeTiers(tierlist.tierlist.maindps),
    ...mergeTiers(tierlist.tierlist.subdps),
    ...mergeTiers(tierlist.tierlist.support),
  ];

  // const mergedTierlistZero = [
  //   ...mergeTiers(tierlist.maindps),
  //   ...mergeTiers(tierlist.subdps),
  //   ...mergeTiers(tierlist.support),
  // ];

  for (const tl of mergedTierlist) {
    charactersMap[tl.id] = characters.find((c) => c.id === tl.id);
    weaponsMap[tl.w_id] = weapons.find((w) => w.id === tl.w_id);
  }

  return {
    props: {
      tierlist: tierlist.tierlist,
      // tierlist,
      // tierlist,
      charactersMap,
      weaponsMap,
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
