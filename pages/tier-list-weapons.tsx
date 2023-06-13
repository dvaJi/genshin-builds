import clsx from "clsx";
import GenshinData, { Weapon } from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

import Metadata from "@components/Metadata";
import WeaponsTier from "@components/genshin/WeaponsTier";

import useIntl from "@hooks/use-intl";
import { useMobileDetect } from "@hooks/use-mobile-detect";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getCommon, getData, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { Roles, TierNums, TierlistWeapons } from "interfaces/tierlist";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

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
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-center text-2xl font-semibold text-gray-200 lg:text-left">
        {t({
          id: "title",
          defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
        })}
      </h2>
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
          <div className="p-5"></div>
          <button
            className={clsx(
              "col-span-2 bg-vulcan-800 p-5",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.maindps ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.maindps)}
          >
            <h3 className="text-center text-lg font-semibold text-white">
              {t({ id: "main_dps", defaultMessage: "Main DPS" })}
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 bg-vulcan-800 p-5",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.subdps ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.subdps)}
          >
            <h3 className="text-center text-lg font-semibold text-white">
              {t({ id: "sub_dps", defaultMessage: "Sub DPS" })}
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 bg-vulcan-800 p-5",
              !isMobile ? "pointer-events-none" : "",
              isMobile && selectedCol !== Roles.support ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.support)}
          >
            <h3 className="text-center text-lg font-semibold text-white">
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
  const tierlist = await getData("genshin", "tierlist-weapons");
  const common = await getCommon(locale, "genshin");

  const weaponsMap = weapons.reduce(
    (map, { id, ...weapon }) => ({ ...map, [id]: weapon }),
    {}
  );

  return {
    props: {
      tierlist,
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

export default TierListWeapons;
