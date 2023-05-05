import Link from "next/link";
import { useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import HSRData, { Character, Languages, renderDescription } from "hsr-builds";
import dynamic from "next/dynamic";
import clsx from "clsx";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";

import { localeToLang } from "@utils/locale-to-lang";
import {
  getCharacterBuild,
  getCharacterMostUsedBuild,
  getCharacterOfficialBuild,
  getLocale,
} from "@lib/localData";
import { getHsrUrl, getUrl, getUrlLQ } from "@lib/imgUrl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import CharacterTrace from "@components/hsr/CharacterTrace";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

interface CharacterPageProps {
  character: Character;
  locale: string;
}

const CharacterPage = ({ character, locale }: CharacterPageProps) => {
  const { t } = useIntl("character");

  return (
    <div className="relative bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, t)}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-3xl font-semibold uppercase leading-loose">
        {character.name}
      </h2>
      <p>{character.description}</p>
      <div className="">
        <div>Rarity: {character.rarity}</div>
        <div>Combat: {character.combat_type.name}</div>
        <div>Path: {character.path.name}</div>
        <div>Faction: {character.faction}</div>
        <div>
          <h2 className="text-xl text-slate-200">Skills</h2>
          <div>
            {character.skills
              .filter((s) => s.tag)
              .map((skill) => (
                <div key={skill.id} className="mb-2 flex">
                  <div className="mr-2 w-[64px] flex-shrink-0 justify-center text-center">
                    <img
                      src={getHsrUrl(
                        `/characters/${character.id}/${skill.id}.png`,
                        70,
                        70
                      )}
                      width={64}
                      height={64}
                      className="w-[64px]"
                      alt={skill.name}
                    />
                    <div className="text-xs">- Lvl1 +</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex">
                      <div className="text-lg font-semibold text-slate-100">
                        {skill.name}
                      </div>
                      <div className="mx-1 rounded bg-slate-800 p-1 text-xs text-slate-200">
                        {skill.type}
                      </div>
                      <div className="mx-1 rounded bg-zinc-800 p-1 text-xs text-slate-200">
                        {skill.tag}
                      </div>
                    </div>
                    <div>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: renderDescription(
                            skill.desc,
                            skill.levels[0].params,
                            1
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl text-slate-200">Traces:</h2>
          <div className="flex flex-col">
            {character.skillTreePoints
              .sort((a, b) => a.type - b.type)
              .map((trace) => (
                <CharacterTrace
                  key={trace.id}
                  trace={trace}
                  characterId={character.id}
                />
              ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl text-slate-200">Eilodons</h2>
          <div>
            {character.eidolons.map((eidolon) => (
              <div key={eidolon.id}>
                <div>
                  <img
                    src={getHsrUrl(
                      `/characters/${character.id}/${eidolon.id}.png`
                    )}
                    alt={eidolon.name}
                  />
                </div>
                <div>{eidolon.name}</div>
                <div>
                  <p dangerouslySetInnerHTML={{ __html: eidolon.desc }} />
                </div>
                <div>{eidolon.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const generateJsonLd = (
  locale: string,
  t: (props: IntlFormatProps) => string
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/characters",
          "name": "${t({
            id: "characters",
            defaultMessage: "Characters",
          })}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(locale, "genshin");
  const hsrData = new HSRData({ language: locale as Languages });
  const characters = await hsrData.characters();
  const character = characters.find((c) => c.id === params?.id);

  if (!character) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      character,
      lngDict,
      locale,
      // bgStyle: {
      //   image: getUrlLQ(
      //     `/regions/${common[character.region] || "Mondstadt"}_d.jpg`,
      //     900,
      //     900
      //   ),
      //   gradient: {
      //     background:
      //       "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
      //   },
      //   stickyImage: getUrlLQ(
      //     `/characters/${character.id}/header_image.png`,
      //     900,
      //     900
      //   ),
      // },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const hsrData = new HSRData();
  const characters = await hsrData.characters({ select: ["id"] });

  const paths: { params: { id: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { id: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
