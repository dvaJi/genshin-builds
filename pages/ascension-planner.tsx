import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { GetStaticProps } from "next";
import format from "date-fns/format";
import GenshinData, { Character, Weapon } from "genshin-data";

import Ads from "@components/Ads";
import SimpleRarityBox from "@components/SimpleRarityBox";

import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToLang } from "@utils/locale-to-lang";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import Button from "@components/Button";

const ServerTimers = dynamic(() => import("@components/ServerTimers"), {
  ssr: false,
});

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
  planMap: Record<string, any>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const C_DOMAINS = ["Forsaken Rift", "Taishan Mansion", "Violet Court"];
const W_DOMAINS = [
  "Cecilia Garden",
  "Hidden Palace of Lianshan Formula",
  "Court of Flowing Sand",
];

const AscensionPlanner = ({ characters, weapons, planMap }: Props) => {
  const [currentDay, setCurrentDay] = useState(format(new Date(), "iii"));
  const { tfn } = useIntl();
  return (
    <div>
      <div>
        <ServerTimers />
        <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
        <div className="mb-2 flex flex-wrap justify-center">
          {DAYS.map((day) => (
            <Button
              key={day}
              className={clsx("rounded mx-2 my-1 p-2 px-4", {
                "bg-vulcan-700": currentDay === day,
                "text-white": currentDay === day,
                "bg-vulcan-800": currentDay !== day,
              })}
              onClick={() => setCurrentDay(day)}
            >
              {tfn({ id: day, defaultMessage: day })}
            </Button>
          ))}
        </div>
        {C_DOMAINS.map((domain) => (
          <div
            key={domain}
            className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800"
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              {tfn({ id: domain, defaultMessage: domain })}
            </h2>
            <div className="flex flex-wrap justify-center">
              {planMap[domain][currentDay].map((cId: string) => (
                <Link key={cId} href={`/character/${cId}`}>
                  <a>
                    <SimpleRarityBox
                      img={getUrl(
                        `/characters/${cId}/${cId}_portrait.png`,
                        96,
                        96
                      )}
                      rarity={characters[cId].rarity}
                      name={characters[cId].name}
                      className="h-24 w-24"
                      nameSeparateBlock={true}
                      classNameBlock="w-24"
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
              {tfn({ id: domain, defaultMessage: domain })}
            </h2>
            <div className="flex flex-wrap justify-center">
              {planMap[domain][currentDay].map((cId: string) => (
                <div key={cId}>
                  {weapons[cId] ? (
                    <Link key={cId} href={`/weapon/${cId}`}>
                      <a>
                        <SimpleRarityBox
                          img={getUrl(`/weapons/${cId}.png`, 96, 96)}
                          rarity={weapons[cId].rarity}
                          name={weapons[cId].name}
                          className="h-24 w-24"
                          nameSeparateBlock={true}
                          classNameBlock="w-24"
                        />
                      </a>
                    </Link>
                  ) : (
                    `NOT FOUND ${cId}`
                  )}
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
  const planning = require(`../_content/data/talents.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const charactersMap = characters.reduce<Record<string, Character>>(
    (map, value) => {
      map[value.id] = { ...value, rarity: value.rarity || 5 };
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
  };
};

export default AscensionPlanner;
