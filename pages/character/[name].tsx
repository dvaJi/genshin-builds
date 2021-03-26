import { ReactNode, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { Artifact, Character, Weapon } from "genshin-data";

import useIntl from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import ElementIcon from "@components/ElementIcon";
import Collapsible from "@components/Collapsible";
import WeaponCard from "@components/WeaponCard";
import ArtifactCard from "@components/ArtifactCard";

import { localeToLang } from "@utils/locale-to-lang";
import { getCharacterBuild, getLocale } from "@lib/localData";
import { Build } from "interfaces/build";
import { appBackgroundStyleState } from "@state/background-atom";
import ArtifactRecommendedStats from "@components/ArtifactRecommendedStats";

interface CharacterPageProps {
  character: Character;
  builds: Build[];
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  lngDict: Record<string, string>;
  locale: string;
}

const CharacterPage = ({
  character,
  builds,
  weapons,
  artifacts,
  lngDict,
  locale,
}: CharacterPageProps) => {
  const setBg = useSetRecoilState(appBackgroundStyleState);
  const [f, fn] = useIntl(lngDict);
  useEffect(() => {
    setBg({
      image: `/_assets/regions/${character.region}_d.jpg`,
      gradient: {
        background: "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
      },
    });
  }, [character]);
  return (
    <div>
      <Metadata
        fn={fn}
        pageTitle={fn({
          id: "title.character.detail",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, lngDict)}
      />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center px-2 lg:px-0">
          <div className="flex-none relative mr-2 lg:mr-5">
            <img
              className="w-24 h-24 bg-vulcan-800 p-1 rounded-full border border-gray-900"
              src={`/_assets/characters/${character.id}/${character.id}_portrait.png`}
              alt={character.name}
            />
          </div>
          <div className="flex flex-col flex-grow">
            <div className="flex items-center mr-2">
              <h1 className="text-3xl mr-2">
                {character.name} ({character.rarity}★)
              </h1>
              <ElementIcon type={character.element} width={30} height={30} />
            </div>
            <div>{character.description}</div>
          </div>
        </div>
      </div>
      <div className="min-w-0 p-4 lg:mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({ id: "character.skills", defaultMessage: "Skills" })}
          </h2>
          {character.skills.map((skill) => (
            <Collapsible
              key={skill.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/_assets/characters/${character.id}/${skill.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">
                    {skill.name}
                  </h3>
                </div>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: skill.description }} />
            </Collapsible>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({ id: "character.passives", defaultMessage: "Passives" })}
          </h2>
          {character.passives.map((passive) => (
            <Collapsible
              key={passive.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/_assets/characters/${character.id}/${passive.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">{passive.name}</h3>
                </div>
              }
            >
              <div dangerouslySetInnerHTML={{ __html: passive.description }} />
            </Collapsible>
          ))}
        </div>
        <div className="mb-4">
          <h2 className="text-3xl mb-2">
            {f({
              id: "character.constellations",
              defaultMessage: "Constellations",
            })}
          </h2>
          {character.constellations.map((constellation) => (
            <Collapsible
              key={constellation.id}
              text={
                <div className="flex self-center">
                  <img
                    className="block mr-2"
                    src={`/_assets/characters/${character.id}/${constellation.id}.png`}
                    height={32}
                    width={32}
                  />
                  <h3 className="text-xl">
                    {constellation.level}: {constellation.name}
                  </h3>
                </div>
              }
            >
              <div
                dangerouslySetInnerHTML={{ __html: constellation.description }}
              />
            </Collapsible>
          ))}
        </div>
        {builds && (
          <div className="mb-4">
            <h2 className="text-3xl mb-3">
              {f({
                id: "character.builds",
                defaultMessage: "Builds",
              })}
            </h2>
            {builds.map((build) => (
              <Collapsible
                key={build.id}
                text={<h3 className="text-2xl">{build.role}</h3>}
                defaultOpen={true}
              >
                <div className="">
                  {/* <p>{build.description}</p> */}
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="flex flex-wrap w-full lg:w-4/5 pr-2 content-start">
                      <div className="text-xl mb-2 font-semibold">
                        {f({
                          id: "weapons",
                          defaultMessage: "Weapons",
                        })}
                        :
                      </div>
                      <div>
                        {build.weapons
                          .map<ReactNode>((weapon) => (
                            <WeaponCard
                              key={weapon.id}
                              weapon={weapons[weapon.id]}
                            />
                          ))
                          .reduce((prev, curr, i) => [
                            prev,
                            <div
                              key={`art_divider_${i}`}
                              className="build-option-divider"
                            >
                              {f({
                                id: "or",
                                defaultMessage: "Or",
                              })}
                            </div>,
                            curr,
                          ])}
                      </div>
                    </div>
                    <div className="flex flex-wrap w-full lg:w-4/5 ml-2 content-start">
                      <div className="text-xl mb-2 font-semibold">
                        {f({
                          id: "artifacts",
                          defaultMessage: "Artifacts",
                        })}
                        :
                      </div>
                      <div className="w-full mb-3">
                        <h2 className="font-bold">
                          {f({
                            id: "character.recommended_primary_stats",
                            defaultMessage: "Recommended Primary Stats",
                          })}
                        </h2>
                        <ArtifactRecommendedStats stats={build.stats} />
                        <div>
                          <h2 className="font-bold">
                            {f({
                              id: "character.substats_priority",
                              defaultMessage: "Substats priority",
                            })}
                          </h2>
                          <div className="text-sm">
                            {build.stats_priority.join(" / ")}
                          </div>
                        </div>
                      </div>
                      {build.sets
                        .map<ReactNode>((set) => (
                          <div key={`${set.set_1.id}-${set.set_2?.id}`}>
                            {set.set_2 ? (
                              <div className="flex flex-row w-full">
                                <ArtifactCard
                                  artifact={artifacts[set.set_1.id]}
                                  pieces={2}
                                />
                                <ArtifactCard
                                  artifact={artifacts[set.set_2.id]}
                                  pieces={2}
                                />
                              </div>
                            ) : (
                              <ArtifactCard
                                artifact={artifacts[set.set_1.id]}
                                pieces={4}
                              />
                            )}
                          </div>
                        ))
                        .reduce((prev, curr, i) => [
                          prev,
                          <div
                            key={`art_divider_${i}`}
                            className="build-option-divider"
                          >
                            {f({
                              id: "or",
                              defaultMessage: "Or",
                            })}
                          </div>,
                          curr,
                        ])}
                    </div>
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// TODO: ADD TALENT ASCENSION TABLE!!!!!

const generateJsonLd = (locale: string, lngDict: Record<string, string>) => {
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
          "name": "${lngDict["title.characters"]}"
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

  // TODO: check why is not generating builds on prod
  const buildsOld: Build[] = await getCharacterBuild(character.id);
  const weaponsList = await genshinData.weapons();
  const artifactsList = await genshinData.artifacts();

  let weapons: Record<string, Weapon> = {};
  let artifacts: Record<string, Artifact> = {};
  let builds: Build[] = [];

  if (buildsOld) {
    const weaponsIds: string[] = [];
    const artifactsIds: string[] = [];
    buildsOld.forEach((build) => {
      weaponsIds.push(...build.weapons.map((w) => w.id));
      artifactsIds.push(
        ...build.sets.reduce<string[]>((arr, set) => {
          arr.push(set.set_1.id);
          if (set.set_2) {
            arr.push(set.set_2.id);
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
      if (weaponsIds.includes(weapon.id)) {
        weapons[weapon.id] = weapon;
      }
    });

    artifactsList.forEach((artifact) => {
      if (artifactsIds.includes(artifact.id)) {
        artifacts[artifact.id] = artifact;
      }
    });
  }

  return {
    props: {
      character,
      builds,
      weapons,
      artifacts,
      lngDict,
      locale,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const genshinData = new GenshinData();
  const characters = await genshinData.characters();

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
