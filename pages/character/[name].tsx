import { useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";
import clsx from "clsx";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Ads from "@components/ui/Ads";
import StarRarity from "@components/StarRarity";
import Metadata from "@components/Metadata";
import ElementIcon from "@components/genshin/ElementIcon";
import CharacterSkill from "@components/genshin/CharacterSkill";
import PassiveSkill from "@components/genshin/CharacterPassiveSkill";
import ConstellationCard from "@components/genshin/CharacterConstellationCard";
import CharacterBuildCard from "@components/genshin/CharacterBuildCard";
import CharacterCommonBuildCard from "@components/genshin/CharacterCommonBuildCard";
import CharacterAscencionMaterials from "@components/genshin/CharacterAscencionMaterials";
import CharacterTalentMaterials from "@components/genshin/CharacterTalentMaterials";
import Card from "@components/ui/Card";

import { localeToLang } from "@utils/locale-to-lang";
import {
  getCharacterBuild,
  getCharacterMostUsedBuild,
  getLocale,
} from "@lib/localData";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";
import { Build, MostUsedBuild } from "interfaces/build";
import { TeamData } from "interfaces/teams";
import { getUrl } from "@lib/imgUrl";
import Link from "next/link";

interface CharacterPageProps {
  character: Character;
  builds: Build[];
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact & { children?: Artifact[] }>;
  locale: string;
  common: Record<string, string>;
  mubuild: MostUsedBuild;
  recommendedTeams: TeamData[];
}

const CharacterPage = ({
  character,
  builds,
  weapons,
  artifacts,
  locale,
  common,
  mubuild,
  recommendedTeams,
}: CharacterPageProps) => {
  const [buildSelected, setBuildSelected] = useState(
    builds.findIndex((b) => b.recommended) ?? 0
  );
  const { t } = useIntl("character");

  return (
    <div className="relative">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="flex items-center px-2 lg:px-0">
          <div className="relative mr-2 flex-none lg:mr-5">
            <img
              className="h-40 w-40 rounded-full border border-gray-900 bg-vulcan-800 p-1"
              src={getUrl(`/characters/${character.id}/image.png`, 160, 160)}
              alt={character.name}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white shadow-black text-shadow">
                {character.name} ({character.rarity}★)
              </h1>
              <ElementIcon
                type={common[character.element]}
                width={30}
                height={30}
              />
            </div>
            <div className="hidden text-gray-200 shadow-black text-shadow md:block">
              {character.description}
            </div>
            <div className="hidden text-gray-200 shadow-black text-shadow md:block">
              {character.affiliation}
            </div>
          </div>
        </div>
      </div>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="relative z-50 mb-2 ml-4 text-3xl text-white shadow-black text-shadow lg:ml-0">
        {t({ id: "skills", defaultMessage: "Skills" })}
      </h2>
      <div
        className={clsx(
          "relative z-20 mb-8 grid w-full grid-cols-1 justify-center gap-4",
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
        <div className="relative z-50 mx-4 mb-8 lg:mx-0">
          <h2 className="mb-3 text-3xl text-white">
            {t({
              id: "builds",
              defaultMessage: "Builds",
            })}
          </h2>
          <div>
            {mubuild && (
              <button
                className={clsx(
                  "my-1 mr-2 rounded bg-opacity-80 p-3 px-5 text-lg backdrop-blur",
                  {
                    "bg-vulcan-700 text-white": buildSelected === -1,
                    "bg-vulcan-800": buildSelected !== -1,
                  }
                )}
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
                className={clsx(
                  "my-1 mr-2 rounded bg-opacity-80 p-3 px-5 text-lg backdrop-blur",
                  {
                    "bg-vulcan-700 text-white": buildSelected === index,
                    "bg-vulcan-800": buildSelected !== index,
                  }
                )}
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
          <Card>
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
          </Card>
        </div>
      )}
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <Card className="mb-4 flex flex-wrap">
        {recommendedTeams.map((team, index) => (
          <div
            key={team.name}
            className="mb-4 flex items-center border-b border-vulcan-600 pb-4"
          >
            <div className="lg:mx-2">#{index + 1}</div>
            <div className="hidden lg:mx-4 lg:block">Tier: {team.tier}</div>
            {team.characters.map((character) => (
              <Link
                key={character.id}
                href={`/character/${character.id}`}
                className="group relative text-center lg:mr-8"
              >
                <img
                  className="rounded-full border-4 border-transparent transition group-hover:border-vulcan-500 group-hover:shadow-xl"
                  src={getUrl(
                    `/characters/${character.id}/${character.id}_portrait.png`,
                    100,
                    100
                  )}
                  alt={character.name}
                  width="100"
                  height="100"
                />
                {character.c_min > 0 && (
                  <div className="absolute bottom-5 right-2/3 rounded-full bg-vulcan-700 p-1 text-xs font-bold text-gray-300">
                    {`C${character.c_min}`}
                  </div>
                )}
                <span className="text-xs lg:text-sm">
                  {t({
                    id: character.role.toLowerCase(),
                    defaultMessage: character.role,
                  })}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </Card>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({ id: "passives", defaultMessage: "Passives" })}
      </h2>
      <div className="mb-8 grid w-full grid-cols-1 justify-center gap-4 lg:grid-cols-3">
        {character.passives.map((passive) => (
          <PassiveSkill
            key={passive.id}
            characterId={character.id}
            passive={passive}
          />
        ))}
      </div>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "constellations",
          defaultMessage: "Constellations",
        })}
      </h2>
      <div className="mb-8 grid w-full grid-cols-1 justify-center gap-4 lg:grid-cols-3">
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
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <Card className="mx-4 mb-8 p-0 lg:mx-0">
        <CharacterAscencionMaterials ascension={character.ascension} />
      </Card>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "talent_materials",
          defaultMessage: "Talent Materials",
        })}
      </h2>
      <Card className="mx-4 p-0 lg:mx-0">
        <CharacterTalentMaterials talents={character.talent_materials} />
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
          "@id": "https://genshin-builds.com/${locale}/characters",
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
  let artifacts: Record<string, Artifact & { children?: Artifact[] }> = {};
  let builds: Build[] = [];
  const mubuild: MostUsedBuild = await getCharacterMostUsedBuild(character.id);

  if (buildsOld) {
    const weaponsIds: string[] = [];
    const artifactsIds: string[] = [];
    buildsOld.forEach((build) => {
      weaponsIds.push(...build.weapons.map((w) => w.id));
      artifactsIds.push(
        ...build.sets.reduce<string[]>((arr, set) => {
          arr.push(...set);

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

    const ATK18BONUS = [
      "gladiators_finale",
      "shimenawas_reminiscence",
      "vermillion_hereafter",
      "echoes_of_an_offering",
    ];

    if (artifactsIds.includes("18atk_set")) {
      artifacts["18atk_set"] = {
        ...artifactsList.find((a) => a.id === "gladiators_finale")!,
        name: lngDict?.character["18atk_set"]
          ? lngDict.character["18atk_set"]
          : "ATK +18% set",
        children: artifactsList.filter((a) => ATK18BONUS.includes(a.id)),
      };
    }

    const Energy20BONUS = ["emblem_of_severed_fate", "the_exile", "scholar"];

    if (artifactsIds.includes("20energyrecharge_set")) {
      artifacts["20energyrecharge_set"] = {
        ...artifactsList.find((a) => a.id === "emblem_of_severed_fate")!,
        name: lngDict?.character["20energyrecharge_set"]
          ? lngDict.character["20energyrecharge_set"]
          : "Energy Recharge +20% set",
        children: artifactsList.filter((a) => Energy20BONUS.includes(a.id)),
      };
    }

    const Physical25BONUS = ["bloodstained_chivalry", "pale_flame", "scholar"];

    if (artifactsIds.includes("25physicaldmg_set")) {
      artifacts["25physicaldmg_set"] = {
        ...artifactsList.find((a) => a.id === "gladiators_finale")!,
        name: lngDict?.character["25physicaldmg_set"]
          ? lngDict.character["25physicaldmg_set"]
          : "Physical DMG +25% set",
        children: artifactsList.filter((a) => Physical25BONUS.includes(a.id)),
      };
    }

    const EM80BONUS = ["gilded_dreams", "instructor", "wanderers_troupe"];

    if (artifactsIds.includes("80elementalmastery_set")) {
      artifacts["80elementalmastery_set"] = {
        ...artifactsList.find((a) => a.id === "wanderers_troupe")!,
        name: lngDict?.character["80elementalmastery_set"]
          ? lngDict.character["80elementalmastery_set"]
          : "Elemental Mastery +80 set",
        children: artifactsList.filter((a) => EM80BONUS.includes(a.id)),
      };
    }
  }

  const common = require(`../../_content/genshin/data/common.json`)[locale];
  const recommendedTeams = require(`../../_content/genshin/data/teams.json`)[
    character.id
  ];

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
      recommendedTeams: recommendedTeams ?? [],
      bgStyle: {
        image: getUrl(
          `/regions/${common[character.region] || "Mondstadt"}_d.jpg`
        ),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
        stickyImage: `${IMGS_CDN}/characters/${character.id}/header_image.png`,
      },
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
