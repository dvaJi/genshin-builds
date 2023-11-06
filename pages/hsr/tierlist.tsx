import clsx from "clsx";
import HSRData, { Character } from "hsr-data";
import { GetStaticProps } from "next";
import Link from "next/link";

import CharacterBlock from "@components/hsr/CharacterBlock";

import Metadata from "@components/Metadata";
import useIntl from "@hooks/use-intl";
import { getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale, getRemoteData } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";
import { Tierlist } from "interfaces/hsr/tierlist";

type Props = {
  characters: Record<string, Character>;
  tierlists: Tierlist;
};

function Tierlist({ characters, tierlists }: Props) {
  const { t } = useIntl("tierlist");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Tier List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Discover a comprehensive tier list ranks all the 5-Star, 4-Star, DPS, and support characters in HSR, allowing you to make informed decisions about your team composition. Stay ahead of the competition and unleash the true potential of your squad with our expertly curated guide. Explore the Tier List and uncover the powerhouses that will lead you to victory in Honkai: Star Rail.",
        })}
      />
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "tierlist",
          defaultMessage: "Tierlist",
        })}
      </h2>
      <p className="px-2 text-sm">
        {t({
          id: "tierlist_desc",
          defaultMessage:
            "Explore the Ultimate Honkai: Star Rail Tier List! Discover the top-performing characters in HSR, including 5-Star, 4-Star, DPS, and support characters, all expertly ranked in this comprehensive guide. Stay ahead of the game and make informed choices with this invaluable resource.",
        })}
      </p>
      <div className="mt-4 flex flex-col bg-hsr-surface2 shadow-2xl">
        {Object.entries(tierlists["overall"]).map(([tier, tierCharacters]) => (
          <div
            key={tier}
            className="flex items-center border-b border-accent-1  py-2 last:border-b-0 "
          >
            <div
              className={clsx(
                "w-16 shrink-0 flex-grow-0 text-center text-2xl font-semibold",
                {
                  "text-red-500": tier === "SS",
                  "text-yellow-500": tier === "S",
                  "text-green-500": tier === "A",
                  "text-blue-500": tier === "B",
                  "text-gray-500": tier === "C",
                }
              )}
            >
              {tier}
            </div>
            <div className="flex flex-wrap">
              {tierCharacters.map((characterId: string) => (
                <Link
                  key={characterId}
                  href={`/hsr/character/${characterId}`}
                  className="mx-2"
                >
                  <CharacterBlock
                    key={characterId}
                    character={characters[characterId]}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const characters = await hsrData.characters({
    select: ["id", "name", "rarity", "combat_type", "path"],
  });

  const tierlists = await getRemoteData("hsr", "tierlist");

  const charactersMap = characters.reduce((acc, character) => {
    acc[character.id] = character;
    return acc;
  }, {} as Record<string, Character>);

  return {
    props: {
      characters: charactersMap,
      tierlists,
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Tierlist;
