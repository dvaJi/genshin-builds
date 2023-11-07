import clsx from "clsx";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import CharacterAscencionMaterials from "@components/genshin/CharacterAscencionMaterials";
import CharacterBuilds from "@components/genshin/CharacterBuilds";
import ConstellationCard from "@components/genshin/CharacterConstellationCard";
import PassiveSkill from "@components/genshin/CharacterPassiveSkill";
import CharacterSkill from "@components/genshin/CharacterSkill";
import CharacterStats from "@components/genshin/CharacterStats";
import CharacterTalentMaterials from "@components/genshin/CharacterTalentMaterials";
import CharacterTeam from "@components/genshin/CharacterTeam";
import ElementIcon from "@components/genshin/ElementIcon";
import Card from "@components/ui/Card";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import {
  getCharacterBuild,
  getCharacterMostUsedBuild,
  getCharacterOfficialBuild,
  getCommon,
  getData,
  getLocale,
} from "@lib/localData";
import { getBonusSet } from "@utils/bonus_sets";
import { localeToLang } from "@utils/locale-to-lang";
import { Build, MostUsedBuild } from "interfaces/build";
import { Beta } from "interfaces/genshin/beta";
import { TeamData } from "interfaces/teams";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface CharacterPageProps {
  character: Character & { beta?: boolean };
  builds: Build[];
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact & { children?: Artifact[] }>;
  locale: string;
  common: Record<string, string>;
  mubuild: MostUsedBuild;
  officialbuild?: MostUsedBuild;
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
  officialbuild,
  recommendedTeams,
}: CharacterPageProps) => {
  const { t } = useIntl("character");

  return (
    <div className="relative">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} in Genshin Impact: The Ultimate Build Guide",
          values: { name: character.name },
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Enhance your Genshin Impact experience with the ultimate builds and top-performing teams for {name}. Unlock in-depth information on their skills, upgrade costs, and much more. Explore now and optimize your gameplay like never before.",
          values: { name: character.name },
        })}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="flex items-center px-2 lg:px-0">
          <div
            className="relative mr-2 flex-none rounded-full border-2 border-gray-900/80 bg-cover shadow-lg lg:mr-5"
            style={{
              backgroundImage: `url('${getUrl(
                `/bg_${character.rarity}star.png`,
                32,
                32
              )})'`,
            }}
          >
            <img
              className={clsx("h-40 w-40 rounded-full")}
              src={getUrl(`/characters/${character.id}/image.png`, 160, 160)}
              alt={character.name}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white">
                {t({
                  id: "character_title",
                  defaultMessage: "Genshin Impact {name} Build",
                  values: { name: character.name },
                })}
              </h1>
              <ElementIcon
                type={common[character.element]}
                width={30}
                height={30}
              />
            </div>
            <div className="hidden text-gray-200 md:block">
              {character.description}
            </div>
            <div className="hidden text-gray-200 md:block">
              {character.affiliation}
            </div>
          </div>
        </div>
      </div>
      {character.beta ? (
        <div className="flex items-center justify-center">
          <div className="rounded border border-red-400/50 bg-red-600/50 p-1 text-center text-white">
            Current content is a subject to change!
          </div>
        </div>
      ) : null}
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      {builds.length > 0 ? (
        <CharacterBuilds
          characterName={character.name}
          builds={builds}
          artifacts={artifacts}
          mubuild={mubuild}
          weapons={weapons}
          officialbuild={officialbuild}
        />
      ) : null}
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "best_team_comp",
          defaultMessage: "Best {name} Teams",
          values: { name: character.name },
        })}
      </h2>
      <Card className="mx-4 mb-4 flex flex-wrap justify-between p-0">
        {recommendedTeams.map((team, index) => (
          <CharacterTeam key={team.name + index} team={team} index={index} />
        ))}
      </Card>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="relative z-50 mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "skills",
          defaultMessage: "{name} Skills",
          values: { name: character.name },
        })}
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
      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
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
      <FrstAds
        placementName="genshinbuilds_incontent_4"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "stats",
          defaultMessage: "Stats",
        })}
      </h2>
      <Card className="mx-4 mb-8 lg:mx-0">
        {character.ascension[1].stats && (
          <CharacterStats ascensions={character.ascension} />
        )}
      </Card>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <Card className="mx-4 mb-8 p-0 lg:mx-0">
        <CharacterAscencionMaterials ascension={character.ascension} />
      </Card>
      <FrstAds
        placementName="genshinbuilds_incontent_5"
        classList={["flex", "justify-center"]}
      />
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
  const beta = await getData<Beta>("genshin", "beta");
  const _character = characters.find((c) => c.id === params?.name);
  const _betaCharacter = beta[locale].characters.find(
    (c: any) => c.id === params?.name
  );

  const character = _character || _betaCharacter;

  if (!character) {
    return {
      notFound: true,
    };
  }

  const common = await getCommon(locale, "genshin");

  const buildsOld: Build[] = await getCharacterBuild(character.id);
  const weaponsList = await genshinData.weapons({
    select: ["id", "name", "rarity", "stats"],
  });
  const artifactsList = await genshinData.artifacts({
    select: ["id", "name", "max_rarity", "two_pc", "four_pc"],
  });

  let weapons: Record<string, Weapon> = {};
  let artifacts: Record<string, Artifact & { children?: Artifact[] }> = {};
  let builds: Build[] = [];
  const mubuild: MostUsedBuild = await getCharacterMostUsedBuild(character.id);
  const officialbuild: MostUsedBuild = await getCharacterOfficialBuild(
    character.id
  );

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
          common[s] ? common[s] : s
        ),
        stats: {
          circlet:
            build.stats?.circlet?.map((s) => (common[s] ? common[s] : s)) || [],
          flower:
            build.stats?.flower?.map((s) => (common[s] ? common[s] : s)) || [],
          goblet:
            build.stats?.goblet?.map((s) => (common[s] ? common[s] : s)) || [],
          plume:
            build.stats?.plume?.map((s) => (common[s] ? common[s] : s)) || [],
          sands:
            build.stats?.sands?.map((s) => (common[s] ? common[s] : s)) || [],
        },
      };
      builds.push(newBuild);
    });

    weaponsList.forEach((weapon) => {
      if (
        weaponsIds.includes(weapon.id) ||
        mubuild?.weapons?.includes(weapon.id) ||
        officialbuild?.weapons?.includes(weapon.id)
      ) {
        weapons[weapon.id] = weapon;
      }
    });

    artifactsList.forEach((artifact) => {
      if (
        artifactsIds.includes(artifact.id) ||
        mubuild?.artifacts?.find((a) => a.includes(artifact.id)) ||
        officialbuild?.artifacts?.find((a) => a.includes(artifact.id))
      ) {
        artifacts[artifact.id] = artifact;
      }
    });

    // Add custom sets by bonus
    const bonusSets = getBonusSet(artifactsList, lngDict?.character, common);
    Object.keys(bonusSets).forEach((key) => {
      if (artifactsIds.includes(key)) {
        artifacts[key] = bonusSets[key];
      }
    });
  }

  const recommendedTeams =
    require(`../../_content/genshin/data/teams.json`)[character.id] || [];

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
      officialbuild,
      recommendedTeams,
      bgStyle: {
        image: getUrlLQ(
          `/regions/${
            character.region ? common[character.region] : "Mondstadt"
          }_d.jpg`,
          900,
          900
        ),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
    revalidate: 60 * 60 * 48,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default CharacterPage;
