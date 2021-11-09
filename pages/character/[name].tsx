import { useEffect, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";
import clsx from "clsx";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Ads from "@components/Ads";
import StarRarity from "@components/StarRarity";
import Metadata from "@components/Metadata";
import ElementIcon from "@components/ElementIcon";
import CharacterSkill from "@components/CharacterSkill";
import PassiveSkill from "@components/CharacterPassiveSkill";
import ConstellationCard from "@components/CharacterConstellationCard";
import CharacterBuildCard from "@components/CharacterBuildCard";
import CharacterCommonBuildCard from "@components/CharacterCommonBuildCard";
import CharacterAscencionMaterials from "@components/CharacterAscencionMaterials";
import CharacterTalentMaterials from "@components/CharacterTalentMaterials";

import { localeToLang } from "@utils/locale-to-lang";
import {
  getCharacterBuild,
  getCharacterMostUsedBuild,
  getLocale,
} from "@lib/localData";
import { setBackground } from "@state/background-atom";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { Build, MostUsedBuild } from "interfaces/build";
import { getUrl } from "@lib/imgUrl";

interface CharacterPageProps {
  character: Character;
  builds: Build[];
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  locale: string;
  common: Record<string, string>;
  mubuild: MostUsedBuild;
}

const CharacterPage = ({
  character,
  builds,
  weapons,
  artifacts,
  locale,
  common,
  mubuild,
}: CharacterPageProps) => {
  const [buildSelected, setBuildSelected] = useState(
    builds.findIndex((b) => b.recommended) ?? 0
  );
  const { t, tfn } = useIntl();
  useEffect(() => {
    setBackground({
      image: getUrl(
        `/regions/${common[character.region] || "Mondstadt"}_d.jpg`
      ),
      gradient: {
        background: "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
      },
    });
  }, [character, common]);
  return (
    <div>
      <Metadata
        fn={tfn}
        pageTitle={tfn({
          id: "title.character.detail",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, tfn)}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center px-2 lg:px-0">
          <div className="flex-none relative mr-2 lg:mr-5">
            <img
              className="w-24 h-24 bg-vulcan-800 p-1 rounded-full border border-gray-900"
              src={getUrl(
                `/characters/${character.id}/${character.id}_portrait.png`,
                86,
                86
              )}
              alt={character.name}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mr-2">
              <h1 className="text-3xl mr-2">
                {character.name} ({character.rarity}★)
              </h1>
              <ElementIcon
                type={common[character.element]}
                width={30}
                height={30}
              />
            </div>
            <div>{character.description}</div>
          </div>
        </div>
      </div>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({ id: "character.skills", defaultMessage: "Skills" })}
      </h2>
      <div
        className={clsx(
          "grid grid-cols-1 gap-4 w-full justify-center mb-4",
          character.skills.length > 3
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "lg:grid-cols-3"
        )}
      >
        {character.skills.map((skill) => (
          <CharacterSkill
            key={skill.id}
            characterId={character.id}
            skill={skill}
          />
        ))}
      </div>
      {builds.length > 0 && (
        <div className="mb-4 mx-4 lg:mx-0">
          <h2 className="text-3xl mb-3">
            {t({
              id: "character.builds",
              defaultMessage: "Builds",
            })}
          </h2>
          <div>
            {mubuild && (
              <button
                className={clsx("rounded text-lg mr-2 my-1 p-3 px-5", {
                  "bg-vulcan-700 text-white": buildSelected === -1,
                  "bg-vulcan-800": buildSelected !== -1,
                })}
                onClick={() => setBuildSelected(-1)}
              >
                <div className="inline-block w-5">
                  <StarRarity rarity={1} />
                </div>
                {t({ id: "most_used", defaultMessage: "Most Used" })}
              </button>
            )}
            {builds.map((build, index) => (
              <button
                key={build.id}
                className={clsx("rounded text-lg mr-2 my-1 p-3 px-5", {
                  "bg-vulcan-700 text-white": buildSelected === index,
                  "bg-vulcan-800": buildSelected !== index,
                })}
                onClick={() => setBuildSelected(index)}
              >
                {build.recommended && (
                  <div className="inline-block w-5">
                    <StarRarity rarity={1} />
                  </div>
                )}
                {build.role} {build.name}
              </button>
            ))}
          </div>
          <div className="bg-vulcan-800 shadow-lg mb-4 p-4">
            {buildSelected === -1 ? (
              <CharacterCommonBuildCard
                build={mubuild}
                artifacts={artifacts}
                weapons={weapons}
              />
            ) : (
              <CharacterBuildCard
                build={builds[buildSelected]}
                artifacts={artifacts}
                weapons={weapons}
              />
            )}
          </div>
        </div>
      )}
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({ id: "character.passives", defaultMessage: "Passives" })}
      </h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 w-full justify-center mb-4">
        {character.passives.map((passive) => (
          <PassiveSkill
            key={passive.id}
            characterId={character.id}
            passive={passive}
          />
        ))}
      </div>
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({
          id: "character.constellations",
          defaultMessage: "Constellations",
        })}
      </h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3 w-full justify-center mb-4">
        {character.constellations
          .filter((c) => c.level > 0)
          .map((constellation) => (
            <ConstellationCard
              key={constellation.id}
              characterId={character.id}
              constellation={constellation}
            />
          ))}
      </div>
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({
          id: "character.ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <div className="bg-vulcan-800 rounded shadow-lg mb-4 mx-4 lg:mx-0">
        <CharacterAscencionMaterials ascension={character.ascension} />
      </div>
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({
          id: "character.talent_materials",
          defaultMessage: "Talent Materials",
        })}
      </h2>
      <div className="bg-vulcan-800 rounded shadow-lg mx-4 lg:mx-0">
        <CharacterTalentMaterials talents={character.talent_materials} />
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
          "@id": "https://genshin-builds.com/${locale}/characters",
          "name": "${t({
            id: "title.characters",
            defaultMessage: "title.characters",
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
  const characters = await genshinData.characters();
  const character = characters.find((c) => c.id === params?.name);

  if (!character) {
    return {
      notFound: true,
    };
  }

  const buildsOld: Build[] = await getCharacterBuild(character.id);
  const weaponsList = await genshinData.weapons({
    select: ["id", "name", "rarity", "stats", "bonus"],
  });
  const artifactsList = await genshinData.artifacts({
    select: ["id", "name", "max_rarity", "two_pc", "four_pc"],
  });

  let weapons: Record<string, Weapon> = {};
  let artifacts: Record<string, Artifact> = {};
  let builds: Build[] = [];
  const mubuild: MostUsedBuild = await getCharacterMostUsedBuild(character.id);

  if (buildsOld) {
    const weaponsIds: string[] = [];
    const artifactsIds: string[] = [];
    buildsOld.forEach((build) => {
      weaponsIds.push(...build.weapons.map((w) => w.id));
      artifactsIds.push(
        ...build.sets.reduce<string[]>((arr, set) => {
          arr.push(set.set_1);
          if (set.set_2) {
            arr.push(set.set_2);
          }

          return arr;
        }, [])
      );
      const newBuild = {
        ...build,
        stats_priority: build.stats_priority.map((s) =>
          lngDict[s] ? lngDict[s] : s
        ),
        stats: {
          circlet: build.stats.circlet.map((s) =>
            lngDict[s] ? lngDict[s] : s
          ),
          flower: build.stats.flower.map((s) => (lngDict[s] ? lngDict[s] : s)),
          goblet: build.stats.goblet.map((s) => (lngDict[s] ? lngDict[s] : s)),
          plume: build.stats.plume.map((s) => (lngDict[s] ? lngDict[s] : s)),
          sands: build.stats.sands.map((s) => (lngDict[s] ? lngDict[s] : s)),
        },
      };
      builds.push(newBuild);
    });

    weaponsList.forEach((weapon) => {
      if (
        weaponsIds.includes(weapon.id) ||
        mubuild?.weapons?.includes(weapon.id)
      ) {
        weapons[weapon.id] = weapon;
      }
    });

    artifactsList.forEach((artifact) => {
      if (
        artifactsIds.includes(artifact.id) ||
        mubuild?.artifacts?.find((a) => a.includes(artifact.id))
      ) {
        artifacts[artifact.id] = artifact;
      }
    });
  }

  const common = require(`../../_content/data/common.json`)[locale];

  return {
    props: {
      character,
      builds,
      weapons,
      artifacts,
      lngDict,
      locale,
      common,
      mubuild,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const genshinData = new GenshinData();
  const characters = await genshinData.characters({ select: ["id"] });

  const paths: { params: { name: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { name: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
