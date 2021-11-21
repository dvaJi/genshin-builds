import clsx from "clsx";
import { useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import GenshinData, { Weapon } from "genshin-data";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import WeaponAscensionMaterials from "@components/WeaponAscensionMaterials";

import { localeToLang } from "@utils/locale-to-lang";
import { getCharacterMostUsedBuild, getLocale } from "@lib/localData";
import { getUrl } from "@lib/imgUrl";

interface WeaponPageProps {
  weapon: Weapon;
  recommendedCharacters: string[];
  locale: string;
}

const WeaponPage = ({
  weapon,
  recommendedCharacters,
  locale,
}: WeaponPageProps) => {
  const [refinement, setRefinement] = useState(0);
  const [weaponStatIndex, setWeaponStatIndex] = useState(0);
  const { t } = useIntl();

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.weapon.detail",
          defaultMessage: "{name} Genshin Impact Weapon Details",
          values: { name: weapon.name },
        })}
        pageDescription={weapon.description}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap lg:flex-nowrap relative items-center px-2 lg:px-0">
          <div
            className="flex-none relative mr-2 lg:mr-5  rounded-lg border border-gray-900 bg-cover"
            style={{
              backgroundImage: `url(${getUrl(`/bg_${weapon.rarity}star.png`)})`,
            }}
          >
            <img
              className="w-52 h-52"
              src={getUrl(`/weapons/${weapon.id}.png`, 208, 208)}
              alt={weapon.name}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mr-2">
              <h1 className="text-3xl mr-2">
                {weapon.name} ({weapon.rarity}★)
              </h1>
            </div>
            <ul>
              <li>
                {t({ id: "type", defaultMessage: "Type" })}: {weapon.type}
              </li>
              <li>
                {t({ id: "secondary", defaultMessage: "Secondary" })}:{" "}
                {weapon.stats.secondary || "N/A"}
              </li>
            </ul>
            <div>{weapon.description}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="float-right">
            <button
              className={clsx("rounded mx-2 my-1 p-1 px-4", {
                "bg-vulcan-700 hover:bg-vulcan-600 text-white":
                  weaponStatIndex > 0,
                "bg-vulcan-800": weaponStatIndex === 0,
              })}
              disabled={weaponStatIndex === 0}
              onClick={() => setWeaponStatIndex(weaponStatIndex - 1)}
            >
              -
            </button>
            <button
              className={clsx("rounded mx-2 my-1 p-1 px-4", {
                "bg-vulcan-700 hover:bg-vulcan-600 text-white":
                  weaponStatIndex < weapon.stats.levels.length,
                "bg-vulcan-800":
                  weaponStatIndex === weapon.stats.levels.length - 1,
              })}
              disabled={weaponStatIndex === weapon.stats.levels.length - 1}
              onClick={() => setWeaponStatIndex(weaponStatIndex + 1)}
            >
              +
            </button>
          </div>
          <h2 className="text-3xl mb-2">
            {t({ id: "stats", defaultMessage: "Stats" })}
          </h2>

          <div className="rounded shadow-lg bg-vulcan-800 p-4">
            <div className="grid grid-cols-2">
              <div>
                <div className="text-xl">
                  {weapon.stats.primary}:{" "}
                  {weapon.stats.levels[weaponStatIndex].primary}
                </div>
                {weapon.stats.secondary && (
                  <div className="text-xl">
                    {weapon.stats.secondary}:{" "}
                    {weapon.stats.levels[weaponStatIndex].secondary}
                  </div>
                )}
              </div>
              <div>
                <div>
                  <div className="text-xl">
                    {t({ id: "level", defaultMessage: "Level" })}:{" "}
                    {weapon.stats.levels[weaponStatIndex].level}
                  </div>
                  <div className="text-xl">
                    {t({ id: "ascension", defaultMessage: "Ascension" })}:{" "}
                    {weapon.stats.levels[weaponStatIndex].ascension}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="float-right">
            <button
              className={clsx("rounded mx-2 my-1 p-1 px-4", {
                "bg-vulcan-700 hover:bg-vulcan-600 text-white": refinement > 0,
                "bg-vulcan-800": refinement === 0,
              })}
              disabled={refinement === 0}
              onClick={() => setRefinement(refinement - 1)}
            >
              -
            </button>
            <button
              className={clsx("rounded mx-2 my-1 p-1 px-4", {
                "bg-vulcan-700 hover:bg-vulcan-600 text-white":
                  refinement < weapon.refinements.length - 1,
                "bg-vulcan-800": refinement === weapon.refinements.length - 1,
              })}
              disabled={refinement === weapon.refinements.length - 1}
              onClick={() => setRefinement(refinement + 1)}
            >
              +
            </button>
          </div>
          <h2 className="text-3xl mb-2">
            {t({ id: "refinement", defaultMessage: "Refinement" })}
          </h2>
          <div className="rounded shadow-lg bg-vulcan-800 p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: weapon.refinements[refinement]?.desc,
              }}
            />
          </div>
        </div>
      </div>
      {recommendedCharacters.length > 0 && (
        <>
          <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
            {t({
              id: "recommended_characters",
              defaultMessage: "Recomended Characters",
            })}
          </h2>
          <div className="mb-4 mx-4 lg:mx-0 flex">
            {recommendedCharacters.map((character) => (
              <Link key={character} href={`/character/${character}`}>
                <a className="mr-10 group rounded-full transition border-4 border-transparent hover:border-vulcan-500">
                  <img
                    className="rounded-full group-hover:shadow-xl"
                    src={getUrl(
                      `/characters/${character}/${character}_portrait.png`,
                      100,
                      100
                    )}
                    alt={character}
                    width="100"
                    height="100"
                  />
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({
          id: "character.ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <div className="bg-vulcan-800 rounded shadow-lg mb-4 mx-4 lg:mx-0">
        <WeaponAscensionMaterials ascension={weapon.ascensions} />
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
          "@id": "https://genshin-builds.com/${locale}/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/weapons",
          "name": "${t({
            id: "title.weapons",
            defaultMessage: "title.weapons",
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
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons();
  const weapon = weapons.find((c) => c.id === params?.name);

  if (!weapon) {
    return {
      notFound: true,
    };
  }

  const builds = await getCharacterMostUsedBuild();
  const recommendedCharacters = [];

  for (const character in builds) {
    const weapons = builds[character].weapons;
    if (weapons.includes(weapon.id)) {
      recommendedCharacters.push(character);
    }
  }

  return {
    props: {
      weapon,
      lngDict,
      locale,
      recommendedCharacters,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const genshinData = new GenshinData();
  const weapons = await genshinData.weapons({ select: ["id"] });

  const paths: { params: { name: string }; locale: string }[] = [];

  for (const locale of locales) {
    weapons.forEach((weapon) => {
      paths.push({ params: { name: weapon.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default WeaponPage;
