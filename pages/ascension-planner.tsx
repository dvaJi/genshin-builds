import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { GetStaticProps } from "next";
import format from "date-fns/format";
import GenshinData, { Character, Weapon } from "genshin-data";

import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

import planning from "../_content/data/talents.json";
import SimpleRarityBox from "@components/SimpleRarityBox";
import ServerTimers from "@components/ServerTimers";
import useIntl from "@hooks/use-intl";
import { IMGS_CDN } from "@lib/constants";

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
  lngDict: Record<string, string>;
  planMap: Record<string, any>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const C_DOMAINS = ["Forsaken Rift", "Taishan Mansion"];
const W_DOMAINS = ["Cecilia Garden", "Hidden Palace of Lianshan Formula"];

const AscensionPlanner = ({ characters, weapons, planMap, lngDict }: Props) => {
  const [currentDay, setCurrentDay] = useState(format(new Date(), "iii"));
  const [_, fn] = useIntl(lngDict);
  return (
    <div>
      <div>
        <ServerTimers />
        <div className="mb-2">
          {DAYS.map((day) => (
            <button
              key={day}
              className={clsx("rounded mr-4 p-2 px-4", {
                "bg-vulcan-700": currentDay === day,
                "text-white": currentDay === day,
                "bg-vulcan-800": currentDay !== day,
              })}
              onClick={() => setCurrentDay(day)}
            >
              {fn({ id: day, defaultMessage: day })}
            </button>
          ))}
        </div>
        {C_DOMAINS.map((domain) => (
          <div
            key={domain}
            className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              {fn({ id: domain, defaultMessage: domain })}
            </h2>
            <div className="flex flex-wrap justify-center">
              {planMap[domain][currentDay].map((cId: string) => (
                <Link key={cId} href={`/character/${cId}`}>
                  <a>
                    <SimpleRarityBox
                      img={`${IMGS_CDN}/characters/${cId}/${cId}_portrait.png`}
                      rarity={characters[cId].rarity}
                      name={characters[cId].name}
                    />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {W_DOMAINS.map((domain) => (
          <div
            key={domain}
            className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              {fn({ id: domain, defaultMessage: domain })}
            </h2>
            <div className="flex flex-wrap justify-center">
              {planMap[domain][currentDay].map((cId: string) => (
                <div key={cId}>
                  <SimpleRarityBox
                    img={`${IMGS_CDN}/weapons/${cId}.png`}
                    rarity={weapons[cId].rarity}
                    name={weapons[cId].name}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const charactersMap = characters.reduce<Record<string, Character>>(
    (map, value) => {
      map[value.id] = value;
      return map;
    },
    {}
  );

  const weaponsMap = weapons.reduce<Record<string, Weapon>>((map, value) => {
    map[value.id] = value;
    return map;
  }, {});

  return {
    props: {
      characters: charactersMap,
      weapons: weaponsMap,
      lngDict,
      planMap: planning,
    },
    revalidate: 1,
  };
};

export default AscensionPlanner;
