import clsx from "clsx";
import format from "date-fns/format";
import GenshinData, { Character, Domains, Weapon } from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import SimpleRarityBox from "@components/SimpleRarityBox";
import Button from "@components/ui/Button";
import Card from "@components/ui/Card";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { trackClick } from "@lib/gtag";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

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
  const { t } = useIntl("ascension_planner");
  const [currentDay, setCurrentDay] = useState(
    days[Number(format(new Date(), "i")) - 1]
  );
  return (
    <div>
      <Card>
        <h1 className="text-lg text-slate-100">
          {t({
            id: "welcome_title",
            defaultMessage: "Welcome to Genshin-Builds! ✨",
          })}
        </h1>
        <p>
          {t({
            id: "welcome_desc",
            defaultMessage:
              "Discover character builds, comprehensive guides, and a wiki database all in one place. Genshin-Builds is here to assist you in planning your farming activities with an ascension calculator. Keep track of your progress effortlessly with a convenient todo list. Level up your Genshin Impact experience with this invaluable resource!",
          })}
        </p>
      </Card>
      <div>
        <ServerTimers />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <div className="mb-2 flex flex-wrap justify-center">
          {days.map((day) => (
            <Button
              key={day}
              className={clsx("mx-2 my-1 rounded p-2 px-4", {
                "bg-vulcan-700": currentDay === day,
                "text-white": currentDay === day,
                "bg-vulcan-800": currentDay !== day,
              })}
              onClick={() => {
                trackClick(`planner_day`);
                setCurrentDay(day);
              }}
            >
              {day}
            </Button>
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-gray-200">
          {t({
            id: "farmable_today",
            defaultMessage: "Farmable today",
          })}
        </h2>
        <Card className="flex flex-col">
          <table>
            {domains.characters.map((charactersDomain) => (
              <tr key={charactersDomain.domainName}>
                <td className="w-18 border-b border-gray-700 py-2 pr-2 align-middle">
                  <h3 className="text-lg text-gray-200 ">
                    {charactersDomain.domainName}
                  </h3>
                </td>
                <td className="border-b border-gray-700 pt-2 align-middle">
                  <div className="flex flex-wrap">
                    {charactersDomain.rotation
                      .find((r) => r.day === currentDay)
                      ?.ids.map((cId) => (
                        <Link key={cId} href={`/character/${cId}`}>
                          <SimpleRarityBox
                            img={getUrl(
                              `/characters/${cId}/${cId}_portrait.png`,
                              80,
                              80
                            )}
                            rarity={characters[cId].rarity}
                            alt={characters[cId].name}
                            className="h-16 w-16"
                          />
                        </Link>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
            {domains.weapons.map((weaponsDomain) => (
              <tr
                key={weaponsDomain.domainName}
                className="border-b border-gray-700 pt-2 align-middle"
              >
                <td className="w-18 border-b border-gray-700 py-2 pr-2 align-middle">
                  <h3 className="text-lg text-gray-200 ">
                    {weaponsDomain.domainName}
                  </h3>
                </td>
                <td className="border-b border-gray-700 pt-2 align-middle">
                  <div className="flex flex-wrap">
                    {weaponsDomain.rotation
                      .find((r) => r.day === currentDay)
                      ?.ids.map((cId) => (
                        <div key={cId}>
                          {weapons[cId] ? (
                            <Link key={cId} href={`/weapon/${cId}`}>
                              <SimpleRarityBox
                                img={getUrl(`/weapons/${cId}.png`, 80, 80)}
                                rarity={weapons[cId].rarity}
                                alt={weapons[cId].name}
                                className="h-16 w-16"
                              />
                            </Link>
                          ) : (
                            `NOT FOUND ${cId}`
                          )}
                        </div>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </Card>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");

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
      bgStyle: {
        image: getUrlLQ(`/regions/Inazuma_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default AscensionPlanner;
