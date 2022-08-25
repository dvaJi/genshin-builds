import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { GetStaticProps } from "next";
import format from "date-fns/format";
import GenshinData, { Character, Domains, Weapon } from "genshin-data";

import Card from "@components/ui/Card";
import Ads from "@components/Ads";
import SimpleRarityBox from "@components/SimpleRarityBox";

import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToLang } from "@utils/locale-to-lang";

import { getUrl } from "@lib/imgUrl";
import Button from "@components/Button";

const ServerTimers = dynamic(() => import("@components/ServerTimers"), {
  ssr: false,
});

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
  domains: Domains;
  days: string[];
};

const AscensionPlanner = ({ characters, weapons, domains, days }: Props) => {
  const [currentDay, setCurrentDay] = useState(
    days[Number(format(new Date(), "i")) - 1]
  );
  return (
    <div>
      <div>
        <ServerTimers />
        <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
        <div className="mb-2 flex flex-wrap justify-center">
          {days.map((day) => (
            <Button
              key={day}
              className={clsx("rounded mx-2 my-1 p-2 px-4", {
                "bg-vulcan-700": currentDay === day,
                "text-white": currentDay === day,
                "bg-vulcan-800": currentDay !== day,
              })}
              onClick={() => setCurrentDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>
        {domains.characters.map((charactersDomain) => (
          <Card key={charactersDomain.domainName}>
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              {charactersDomain.domainName}
            </h2>
            <div className="flex flex-wrap justify-center">
              {charactersDomain.rotation
                .find((r) => r.day === currentDay)
                ?.ids.map((cId) => (
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
          </Card>
        ))}
        {domains.weapons.map((weaponsDomain) => (
          <Card key={weaponsDomain.domainName}>
            <h2 className="mb-6 text-2xl font-semibold text-gray-200">
              {weaponsDomain.domainName}
            </h2>
            <div className="flex flex-wrap justify-center">
              {weaponsDomain.rotation
                .find((r) => r.day === currentDay)
                ?.ids.map((cId) => (
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const domains = await genshinData.domains();
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
      domains: domains,
      days: domains.characters[0].rotation.map((r) => r.day),
    },
  };
};

export default AscensionPlanner;
