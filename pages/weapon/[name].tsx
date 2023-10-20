import clsx from "clsx";
import GenshinData, { Weapon } from "genshin-data";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import WeaponAscensionMaterials from "@components/genshin/WeaponAscensionMaterials";
import Card from "@components/ui/Card";

import { getUrl } from "@lib/imgUrl";
import { getCharacterMostUsedBuild, getData, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { Beta } from "interfaces/genshin/beta";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface WeaponPageProps {
  weapon: Weapon & { beta?: boolean };
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
  const { t } = useIntl("weapon");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} Genshin Impact Weapon Details",
          values: { name: weapon.name },
        })}
        pageDescription={weapon.description}
        jsonLD={generateJsonLd(locale, t)}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      {weapon.beta ? (
        <div className="flex items-center justify-center">
          <div className="rounded border border-red-400/50 bg-red-600/50 p-1 text-center text-white">
            Current content is a subject to change!
          </div>
        </div>
      ) : null}
      <div className="mb-4 flex items-start justify-between">
        <div className="relative flex flex-wrap items-center px-2 lg:flex-nowrap lg:px-0">
          <div
            className="relative mr-2 flex-none rounded-lg border border-gray-900 bg-cover lg:mr-5"
            style={{
              backgroundImage: `url(${getUrl(`/bg_${weapon.rarity}star.png`)})`,
            }}
          >
            <img
              className="h-52 w-52"
              src={getUrl(`/weapons/${weapon.id}.png`, 236, 236)}
              alt={weapon.name}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white">
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className="float-right">
            <button
              className={clsx("mx-2 my-1 rounded border p-1 px-4", {
                "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                  weaponStatIndex > 0,
                "border-gray-800 bg-vulcan-800": weaponStatIndex === 0,
              })}
              disabled={weaponStatIndex === 0}
              onClick={() => setWeaponStatIndex(weaponStatIndex - 1)}
            >
              -
            </button>
            <button
              className={clsx("mx-2 my-1 rounded border p-1 px-4", {
                "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                  weaponStatIndex < weapon.stats.levels.length,
                "border-gray-800 bg-vulcan-800":
                  weaponStatIndex === weapon.stats.levels.length - 1,
              })}
              disabled={weaponStatIndex === weapon.stats.levels.length - 1}
              onClick={() => setWeaponStatIndex(weaponStatIndex + 1)}
            >
              +
            </button>
          </div>
          <h2 className="mb-2 text-3xl text-white">
            {t({ id: "stats", defaultMessage: "Stats" })}
          </h2>
          <Card>
            <div className="grid grid-cols-2">
              <div>
                <div className="text-xl">
                  {weapon.stats.primary}:{" "}
                  {weapon.stats.levels[weaponStatIndex]?.primary}
                </div>
                {weapon.stats.secondary && (
                  <div className="text-xl">
                    {weapon.stats.secondary}:{" "}
                    {weapon.stats.levels[weaponStatIndex]?.secondary}
                  </div>
                )}
              </div>
              <div>
                <div>
                  <div className="text-xl">
                    {t({ id: "level", defaultMessage: "Level" })}:{" "}
                    {weapon.stats.levels[weaponStatIndex]?.level}
                  </div>
                  <div className="text-xl">
                    {t({ id: "ascension", defaultMessage: "Ascension" })}:{" "}
                    {weapon.stats.levels[weaponStatIndex]?.ascension}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="mb-8">
          <div className="float-right">
            <button
              className={clsx("mx-2 my-1 rounded border p-1 px-4", {
                "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                  refinement > 0,
                "border-gray-800 bg-vulcan-800": refinement === 0,
              })}
              disabled={refinement === 0}
              onClick={() => setRefinement(refinement - 1)}
            >
              -
            </button>
            <button
              className={clsx("mx-2 my-1 rounded border p-1 px-4", {
                "border-gray-700 bg-vulcan-700 text-white hover:bg-vulcan-600":
                  refinement < weapon.refinements.length - 1,
                "border-gray-800 bg-vulcan-800":
                  refinement === weapon.refinements.length - 1,
              })}
              disabled={refinement === weapon.refinements.length - 1}
              onClick={() => setRefinement(refinement + 1)}
            >
              +
            </button>
          </div>
          <h2 className="mb-2 text-3xl text-white">
            {t({ id: "refinement", defaultMessage: "Refinement" })}
          </h2>
          <Card>
            <div
              dangerouslySetInnerHTML={{
                __html: weapon.refinements[refinement]?.desc,
              }}
            />
          </Card>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      {recommendedCharacters.length > 0 && (
        <>
          <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
            {t({
              id: "recommended_characters",
              defaultMessage: "Recomended Characters",
            })}
          </h2>
          <div className="mx-4 mb-4 flex lg:mx-0">
            {recommendedCharacters.map((character) => (
              <Link
                key={character}
                href={`/character/${character}`}
                className="group mr-10 rounded-full border-4 border-transparent transition hover:border-vulcan-500"
              >
                <img
                  className="rounded-full group-hover:shadow-xl"
                  src={getUrl(
                    `/characters/${character}/${character}_portrait.png`,
                    126,
                    126
                  )}
                  alt={character}
                  width="100"
                  height="100"
                />
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <Card className="mx-4 p-0 lg:mx-0">
        <WeaponAscensionMaterials ascension={weapon.ascensions} />
      </Card>
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
            id: "weapons",
            defaultMessage: "weapons",
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
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons();
  const _weapon = weapons.find((c) => c.id === params?.name);
  const beta = await getData<Beta>("genshin", "beta");
  const _betaWeapon = beta[locale].weapons.find(
    (c: any) => c.id === params?.name
  );

  const weapon = _weapon || _betaWeapon;

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
    revalidate: 60 * 60 * 48,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
};

export default WeaponPage;
