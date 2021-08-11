import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";
import clsx from "clsx";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import ElementIcon from "@components/ElementIcon";
import Collapsible from "@components/Collapsible";
import CharacterSkill from "@components/CharacterSkill";
import PassiveSkill from "@components/CharacterPassiveSkill";
import ConstellationCard from "@components/CharacterConstellationCard";
import CharacterBuildCard from "@components/CharacterBuildCard";
import CharacterAscencionMaterials from "@components/CharacterAscencionMaterials";
import CharacterTalentMaterials from "@components/CharacterTalentMaterials";

import { localeToLang } from "@utils/locale-to-lang";
import { getCharacterBuild, getLocale } from "@lib/localData";
import { appBackgroundStyleState } from "@state/background-atom";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";
import { Build } from "interfaces/build";
import StarRarity from "@components/StarRarity";
import Ads from "@components/Ads";
import Crement from "@components/Crement";
import WeaponAscensionMaterials from "@components/WeaponAscensionMaterials";

interface WeaponPageProps {
  weapon: Weapon;
  locale: string;
  common: Record<string, string>;
}

const WeaponPage = ({ weapon, locale, common }: WeaponPageProps) => {
  const [refinement, setRefinement] = useState(1);
  const [ascension, setAscension] = useState(0);
  const { t } = useIntl();

  const showPrimary = (
    base: number,
    values: any[],
    type: "primary" | "secondary"
  ) => {
    if (values[ascension]) {
      return values[ascension][type];
    }

    if (values.length > 0) {
      return values[values.length - 1][type];
    }

    return base;
  };

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.character.detail",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: weapon.name },
        })}
        pageDescription={weapon.description}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap lg:flex-nowrap relative items-center px-2 lg:px-0">
          <div className="flex-none relative mr-2 lg:mr-5">
            <img
              className="w-52 h-52 bg-vulcan-800 p-1 rounded-lg border border-gray-900"
              src={`${IMGS_CDN}/weapons/${weapon.id}.png`}
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
              <li>Type: {weapon.type}</li>
              <li>Secondary: {weapon.secondary?.name}</li>
              <li>Type: {weapon.type}</li>
            </ul>
            <div>{weapon.description}</div>
          </div>
          <div className="lg:absolute top-0 right-0 lg:flex justify-center">
            <Crement
              title={t({ id: "ascension", defaultMessage: "Ascension" })}
              currentValue={ascension}
              setValue={setAscension}
              values={[0, 1, 2, 3, 4, 5, 6]}
            />
            <Crement
              title={t({ id: "refinement", defaultMessage: "Refinement" })}
              currentValue={refinement}
              values={[1, 2, 3, 4, 5]}
              setValue={setRefinement}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-3xl">Stats</h2>
          <div className="rounded shadow-lg bg-vulcan-800 p-4">
            <div className="text-xl">
              {weapon.primary.name}:{" "}
              {showPrimary(weapon.primary.value, weapon.ascensions, "primary")}
            </div>
            {weapon.secondary && (
              <div className="text-xl">
                {weapon.secondary.name}:{" "}
                {showPrimary(
                  weapon.primary.value,
                  weapon.ascensions,
                  "secondary"
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-3xl">
            {t({ id: "refinement", defaultMessage: "Refinement" })}
          </h2>

          <div className="rounded shadow-lg bg-vulcan-800 p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: weapon.refinements[refinement - 1]?.desc,
              }}
            />
          </div>
        </div>
      </div>
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

  return {
    props: {
      weapon,
      lngDict,
      locale,
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
