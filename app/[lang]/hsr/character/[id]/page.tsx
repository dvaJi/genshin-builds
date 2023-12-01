import clsx from "clsx";
import HSRData, {
  languages,
  renderDescription,
  type Character,
  type LightCone,
  type Relic,
} from "hsr-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BsPersonFill } from "react-icons/bs";

import CharacterBestEquip from "@components/hsr/CharacterBestEquip";
import CharacterBuild from "@components/hsr/CharacterBuild";
import CharacterInfoStat from "@components/hsr/CharacterInfoStat";
import CharacterTrace from "@components/hsr/CharacterTrace";
import Stars from "@components/hsr/Stars";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl } from "@lib/imgUrl";
import { getStarRailBuild } from "@lib/localData";
import { getHsrId } from "@utils/helpers";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  const routes: { lang: string; id: string }[] = [];

  for await (const lang of langs) {
    const language = languages.find((l) => l === lang) ?? "en";
    const hsrData = new HSRData({ language });
    const characters = await hsrData.characters({ select: ["id"] });

    characters.forEach((character) => {
      routes.push({
        lang,
        id: character.id,
      });
    });
  }

  return routes;
}

interface Props {
  params: {
    id: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, langData, locale } = await useTranslations(
    params.lang,
    "hsr",
    "characters"
  );

  const hsrData = new HSRData({ language: langData as any });
  const characters = await hsrData.characters({
    select: ["id", "name"],
  });
  const character = characters.find((i) => i.id === params.id);

  if (!character) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail {name} Build Guide",
    values: { name: character.name },
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover the best builds and teams for {name} in Honkai: Star Rail. Also included are their skills, upgrade costs, and more.",
    values: { name: character.name },
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/character/${params.id}`,
    image: getHsrUrl(`/characters/${character.id}/icon.png`),
    locale,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "hsr",
    "character"
  );

  const hsrData = new HSRData({ language: langData as any });
  const characters = await hsrData.characters();
  const character = characters.find((i) => i.id === params.id);

  if (!character) {
    return notFound();
  }

  const _lightcones = await hsrData.lightcones({
    select: ["id", "name", "rarity"],
  });
  const _relics = await hsrData.relics({
    select: ["id", "name"],
  });

  const build = await getStarRailBuild(character.id);

  let charactersMap: Record<string, Character> = {};
  let lightConesMap: Record<string, LightCone> = {};
  let relicsMap: Record<string, Relic> = {};

  build?.teams.forEach((t) => {
    t.data.characters.forEach((c) => {
      const character = characters.find((ch) => ch.id === getHsrId(c.id));
      if (character) {
        charactersMap[character.id] = {
          id: character.id,
          name: character.name,
          rarity: character.rarity,
          path: character.path,
          combat_type: character.combat_type,
        } as any;
      } else if (!c.isFlex) {
        // console.log({ c });
      }
    });

    t.data.alternatives.forEach((c) => {
      const character = characters.find((ch) => ch.id === getHsrId(c));
      if (character) {
        charactersMap[character.id] = {
          id: character.id,
          name: character.name,
          rarity: character.rarity,
          path: character.path,
          combat_type: character.combat_type,
        } as any;
      } else {
        // console.log({ c });
      }
    });
  });

  build?.builds.forEach((b) => {
    const lightCone = _lightcones.find((l) => l.id === b.data.bestLightCone);
    if (lightCone) {
      lightConesMap[lightCone.id] = lightCone;
    }

    b.data.relics.forEach((r) => {
      const relic = _relics.find((re) => re.id === r);
      if (relic) {
        relicsMap[relic.id] = relic;
      }
    });
  });

  build?.lightcones.forEach((l) => {
    const lightCone = _lightcones.find((lc) => lc.id === l);
    if (lightCone) {
      lightConesMap[lightCone.id] = lightCone;
    }
  });

  build?.relics.set.forEach((r) => {
    r.ids.forEach((id) => {
      const relic = _relics.find((re) => re.id === id);
      if (relic) {
        relicsMap[relic.id] = relic;
      }
    });
  });

  build?.relics.ornament.forEach((r) => {
    const relic = _relics.find((re) => re.id === r);
    if (relic) {
      relicsMap[relic.id] = relic;
    }
  });

  const lastAscend = character.ascends[character.ascends.length - 1];
  const maxHp = lastAscend.hpBase + lastAscend.hpAdd * 79;
  const maxAtk = lastAscend.attackBase + lastAscend.attackAdd * 79;
  const maxDef = lastAscend.defenseBase + lastAscend.defenseAdd * 79;
  const maxSpeed = lastAscend.speedBase + lastAscend.speedAdd * 79;

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="flex justify-center">
          <img
            src={getHsrUrl(`/characters/${character.id}/icon.png`)}
            alt={character.name}
            width={144}
            height={168}
            className={clsx("rounded border", {
              "border-yellow-400": character.rarity === 5,
              "border-purple-400": character.rarity === 4,
            })}
          />
        </div>
        <div className="ml-4">
          <h2 className="flex items-center text-3xl font-semibold leading-loose text-slate-50">
            {character.name}
            <img
              src={getHsrUrl(`/${character.combat_type.id}.webp`)}
              alt={character.combat_type.name}
              width={24}
              height={24}
              loading="lazy"
              className="ml-2 inline-block w-[24px] select-none"
            />
          </h2>
          <div className="flex items-center">
            <Stars stars={character.rarity} />
            <div className="ml-4 flex items-center">
              <img
                src={getHsrUrl(`/${character.path.id}.webp`)}
                alt={character.path.name}
                width="20"
                height="20"
                loading="lazy"
                className="mr-2 inline-block w-[16px] select-none"
              />
              <span className="text-sm">{character.path.name}</span>
            </div>
          </div>
          <p>{character.description}</p>
        </div>
        <div className="ml-3 flex w-full max-w-[320px] flex-col justify-center md:ml-8">
          <CharacterInfoStat label="hp" value={maxHp} max={1500} />
          <CharacterInfoStat label="atk" value={maxAtk} max={1500} />
          <CharacterInfoStat label="def" value={maxDef} max={1000} />
          <CharacterInfoStat label="speed" value={maxSpeed} max={500} />
        </div>
      </div>
      <div className="relative bg-hsr-surface1 p-4 shadow-2xl">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

        <div className="">
          {build?.builds.map((b) => (
            <CharacterBuild
              key={b.name}
              characterName={character.name}
              name={b.name}
              data={b.data}
              lightConesMap={lightConesMap}
              relicsMap={relicsMap}
            />
          ))}
          {build ? (
            <>
              <CharacterBestEquip
                characterName={character.name}
                relics={build.relics}
                lightcones={build.lightcones}
                lightConesMap={lightConesMap}
                relicsMap={relicsMap}
              />
              <h2 className="text-xl text-slate-200">
                {t({
                  id: "best_teams",
                  defaultMessage: "{name} Best Teams",
                  values: { name: character.name },
                })}
              </h2>
              {build.teams.map((team) => (
                <div key={team.name} className="mt-4">
                  <h3 className="text-lg text-slate-300">{team.name}</h3>
                  <div className="flex flex-wrap gap-4">
                    {team.data.characters.map((c) => (
                      <div
                        key={c.id}
                        className="group relative mb-2 flex max-w-xl items-center rounded bg-hsr-surface2 p-2 hover:bg-hsr-surface3"
                      >
                        {c.isFlex ? (
                          <div className="hmr-1 flex flex-shrink-0 items-center justify-center">
                            <div className="mr-2 h-[56px] w-[48px] rounded border border-gray-200/5 bg-gray-200/5">
                              <BsPersonFill className="h-full w-full opacity-10 group-hover:opacity-30" />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="flex items-center text-slate-50">
                                <span className="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                                  {c.role}
                                </span>
                              </h3>
                              <span className="text-sm">{c.id}</span>
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={`/${params.lang}/hsr/character/${c.id}`}
                            className="flex items-center"
                          >
                            <div className="mr-2 flex flex-shrink-0 items-center justify-center">
                              <div className="flex-shrink-0 justify-center rounded-full text-center">
                                <img
                                  src={getHsrUrl(
                                    `/characters/${getHsrId(c.id)}/icon.png`
                                  )}
                                  alt={charactersMap[getHsrId(c.id)].name}
                                  width={48}
                                  height={56}
                                  className={clsx("rounded border", {
                                    "border-yellow-400":
                                      charactersMap[getHsrId(c.id)].rarity ===
                                      5,
                                    "border-purple-400":
                                      charactersMap[getHsrId(c.id)].rarity ===
                                      4,
                                  })}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="flex items-center text-slate-50">
                                <span className="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">
                                  {charactersMap[getHsrId(c.id)].name}
                                </span>
                                <img
                                  src={getHsrUrl(
                                    `/${
                                      charactersMap[getHsrId(c.id)].combat_type
                                        .id
                                    }.webp`
                                  )}
                                  alt={
                                    charactersMap[getHsrId(c.id)].combat_type
                                      .name
                                  }
                                  width={24}
                                  height={24}
                                  loading="lazy"
                                  className="ml-2 inline-block w-[24px] select-none"
                                />
                              </h3>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  <img
                                    src={getHsrUrl(
                                      `/${
                                        charactersMap[getHsrId(c.id)].path.id
                                      }.webp`
                                    )}
                                    alt={
                                      charactersMap[getHsrId(c.id)].path.name
                                    }
                                    width="20"
                                    height="20"
                                    loading="lazy"
                                    className="mr-2 inline-block w-[16px] select-none"
                                  />
                                  <span className="text-sm">{c.role}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : null}
          <FrstAds
            placementName="genshinbuilds_incontent_1"
            classList={["flex", "justify-center"]}
          />
          <div>
            <h2 className="text-xl text-slate-200">
              {t({
                id: "skills",
                defaultMessage: "Skills",
              })}
            </h2>
            <div>
              {character.skills
                .filter((s) => s.tag)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative mb-2 flex items-center"
                  >
                    <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                      <div className="flex-shrink-0 justify-center rounded-full bg-hsr-surface3 text-center">
                        <img
                          src={getHsrUrl(
                            `/characters/${character.id}/${skill.id}.png`,
                            70,
                            70
                          )}
                          width={64}
                          height={64}
                          className="p-1"
                          alt={skill.name}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col p-2">
                      <div className="flex items-center">
                        <div className="font-semibold text-slate-200">
                          {skill.name}
                        </div>
                        <div className="mx-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
                          {skill.type}
                        </div>
                        <div className="mx-1 rounded bg-zinc-800 px-2 py-1 text-xs text-slate-300">
                          {skill.tag}
                        </div>
                      </div>
                      <div className="flex flex-wrap">
                        <p
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: renderDescription(
                              skill.desc,
                              skill.levels[0].params
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <FrstAds
            placementName="genshinbuilds_incontent_2"
            classList={["flex", "justify-center"]}
          />
          <div>
            <h2 className="text-xl text-slate-200">
              {t({
                id: "traces",
                defaultMessage: "Traces",
              })}
            </h2>
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
          <FrstAds
            placementName="genshinbuilds_incontent_3"
            classList={["flex", "justify-center"]}
          />
          <div>
            <h2 className="text-xl text-slate-200">
              {t({
                id: "eidolon",
                defaultMessage: "Eidolon",
              })}
            </h2>
            <div>
              {character.eidolons.map((eidolon) => (
                <div key={eidolon.id} className="mb-2 flex items-center">
                  <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                    <div className="flex-shrink-0 justify-center rounded-full bg-hsr-surface3 text-center">
                      <img
                        src={getHsrUrl(
                          `/characters/${character.id}/${eidolon.id}.png`
                        )}
                        width={64}
                        height={64}
                        alt={eidolon.name}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {eidolon.name}
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: eidolon.desc ?? "" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
