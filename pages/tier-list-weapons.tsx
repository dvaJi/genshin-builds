import { useState } from "react";
import { GetStaticProps } from "next";
import clsx from "clsx";
import GenshinData, { Weapon } from "genshin-data";

import Metadata from "@components/Metadata";

import { getLocale } from "@lib/localData";
import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { Roles, TierlistWeapons, TierNums } from "interfaces/tierlist";
import WeaponsTier from "@components/WeaponsTier";
import { IMGS_CDN } from "@lib/constants";
import { useMobileDetect } from "@hooks/use-mobile-detect";

type Props = {
  tierlist: Record<string, TierlistWeapons>;
  weaponsMap: Record<string, Pick<Weapon, "id" | "name" | "rarity">>;
};

const weaponTypes = ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"];

const TierListWeapons = ({ tierlist, weaponsMap }: Props) => {
  const { isMobile } = useMobileDetect();
  const [typeFilter, setTypeFilter] = useState("sword");
  const [selectedCol, setSelectedCol] = useState<Roles | null>(
    isMobile() ? Roles.maindps : null
  );

  const { t, tfn } = useIntl();

  const changeTierTab = (role: Roles) => {
    if (isMobile()) {
      setSelectedCol(role);
    } else {
      setSelectedCol(null);
    }
  };

  return (
    <div>
      <Metadata
        fn={tfn}
        pageTitle={tfn({
          id: "title.tierlist_weapons",
          defaultMessage: "Genshin Impact Weapons Tier List (Best Weapons)",
        })}
        pageDescription={tfn({
          id: "title.tierlist_weapons.description",
          defaultMessage:
            "All the best weapons ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <h2 className="text-center lg:text-left my-6 text-2xl font-semibold text-gray-200">
        {t({
          id: "title.tierlist_weapons",
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
                if (type === typeFilter) {
                  setTypeFilter("");
                } else {
                  setTypeFilter(type.toLowerCase());
                }
              }}
            >
              <img
                className="w-16 h-16"
                src={`${IMGS_CDN}/weapons_type/${type}.png`}
              />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-4 w-full">
          <div className="p-5"></div>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              isMobile() && selectedCol !== Roles.maindps ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.maindps)}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              Main DPS
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              isMobile() && selectedCol !== Roles.subdps ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.subdps)}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              Sub DPS
            </h3>
          </button>
          <button
            className={clsx(
              "col-span-2 p-5 bg-vulcan-800",
              isMobile() && selectedCol !== Roles.support ? "opacity-50" : ""
            )}
            onClick={() => changeTierTab(Roles.support)}
          >
            <h3 className="text-lg text-white text-center font-semibold">
              Support
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
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const { default: tierlist = {} }: any = await import(
    `../_content/data/tierlist-weapons.json`
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
    },
    revalidate: 1,
  };
};

export default TierListWeapons;
