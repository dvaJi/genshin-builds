import { useState } from "react";
import { GetStaticProps } from "next";
import clsx from "clsx";
import GenshinData, { Weapon } from "genshin-data";

import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import WeaponsTier from "@components/genshin/WeaponsTier";

import { getLocale } from "@lib/localData";
import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { Roles, TierlistWeapons, TierNums } from "interfaces/tierlist";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { useMobileDetect } from "@hooks/use-mobile-detect";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { trackClick } from "@lib/gtag";

type Props = {
  tierlist: Record<string, TierlistWeapons>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
};

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

const TierListWeapons = ({ tierlist, weaponsMap }: Props) => {
  const { isMobile } = useMobileDetect();
  const [typeFilter, setTypeFilter] = useState("sword");
  const [selectedCol, setSelectedCol] = useState<Roles | null>(
    isMobile ? Roles.maindps : null
  );

  const { t } = useIntl("tierlist_weapons");

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
          defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best weapons ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-center lg:text-left my-6 text-2xl font-semibold text-gray-200">
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
        })}
      </h2>
      <div className="rounded">
        <div className="text-center my-4">
          {weaponTypes.map((type) => (
            <button
              key={type}
              className={clsx(
                "border rounded hover:border-gray-700 hover:bg-vulcan-800 mr-1",
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
                className="w-16 h-16"
                alt={type}
                src={getUrl(`/weapons_type/${type}.png`, 64, 64)}
              />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-4 w-full">
          <div className="p-5"></div>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.maindps ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.maindps)}
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
            onClick={() => changeTierTab(Roles.subdps)}
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
            onClick={() => changeTierTab(Roles.support)}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              {t({ id: "support", defaultMessage: "Support" })}
            </h3>
          </button>
        </div>
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
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const { default: tierlist = {} }: any = await import(
    `../_content/genshin/data/tierlist-weapons.json`
  );

  const weaponsMap = weapons.reduce<Record<string, Weapon>>((map, val) => {
    map[val.id] = val;
    return map;
  }, {});

  return {
    props: {
      tierlist,
      weaponsMap,
      lngDict,
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

export default TierListWeapons;
