import clsx from "clsx";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

import { genPageMetadata } from "@app/seo";

import ElementIcon from "@components/genshin/ElementIcon";
import Button from "@components/ui/Button";
import FrstAds from "@components/ui/FrstAds";
import useTranslations from "@hooks/use-translations";
import type { Artifact, Beta, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { getData, getRemoteData } from "@lib/localData";
import { capitalize } from "@utils/capitalize";
import { localeToLang } from "@utils/locale-to-lang";
import { i18n } from "i18n-config";
import { TeamData, Teams } from "interfaces/teams";
import { Fragment } from "react";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });

type Props = {
  params: { lang: string; character: string };
};

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string; id: string }[] = [];

  for await (const lang of i18n.locales) {
    const _characters = await getGenshinData<Character[]>({
      resource: "characters",
      language: localeToLang(lang),
      select: ["id"],
    });

    routes.push(
      ..._characters.map((c) => ({
        lang,
        id: c.id,
      }))
    );
  }

  return routes;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale, langData } = await useTranslations(
    params.lang,
    "genshin",
    "teams"
  );
  const beta = await getData<Beta>("genshin", "beta");
  const _character = await getGenshinData<Character>({
    resource: "characters",
    language: langData as any,
    select: ["id", "name"],
    filter: {
      id: params.character,
    },
  });
  const _betaCharacter = beta[locale].characters.find(
    (c: any) => c.id === params.character
  );

  const character = _character || _betaCharacter;

  if (!character) {
    return;
  }

  const title = t({
    id: "detail_title",
    defaultMessage: "{name} Team Guide: Mastering Synergy in Genshin Impact",
    values: { name: character.name },
  });
  const description = t({
    id: "detail_title",
    defaultMessage:
      "Unlock the full potential of your {name} team in Genshin Impact with our comprehensive guide. Discover optimal team compositions, artifact recommendations, and gameplay strategies to dominate in Teyvat.",
    values: { name: character.name },
  });

  return genPageMetadata({
    title,
    description,
    path: `/teams/${params.character}`,
    locale,
  });
}

export default async function GenshinCharacterTeams({ params }: Props) {
  const { t, langData, locale, common } = await useTranslations(
    params.lang,
    "genshin",
    "teams"
  );

  const characters = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "element", "rarity"],
    asMap: true,
  });
  const character = characters[params.character];

  if (!character) {
    return redirect(`/${params.lang}/teams`);
  }

  const teams = await getRemoteData<Teams>("genshin", "teams");
  const characterTeams = teams[params.character];

  // No teams for this character, redirect to the character page instead.
  if (!characterTeams) {
    return redirect(`/${params.lang}/character/${params.character}`);
  }

  const weaponsMap = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    language: langData as any,
    select: ["id", "name"],
    asMap: true,
  });

  const artifactsMap = await getGenshinData<Record<string, Artifact>>({
    resource: "artifacts",
    language: langData as any,
    select: ["id", "name", "two_pc", "four_pc"],
    asMap: true,
  });

  return (
    <div className="relative mx-auto max-w-screen-md">
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="">
        <div className="card mb-6">
          <div className="mb-4 flex">
            <div
              className={clsx(
                "relative mr-2 flex-none overflow-hidden rounded-xl",
                `genshin-bg-rarity-${character.rarity}`
              )}
            >
              <img
                src={getUrl(`/characters/${character.id}/image.png`, 100, 100)}
                alt={character.name}
              />
            </div>
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white">
                {t("detail_character", {
                  name: character.name,
                })}
              </h1>
              <ElementIcon
                type={common[character.element]}
                width={30}
                height={30}
              />
            </div>
          </div>
          <p className="text-slate-300">{characterTeams.overview}</p>
          <div className="mt-4 flex justify-end">
            <Link href={`/${locale}/character/${params.character}`}>
              <Button>
                {t("view_character_page", {
                  name: character.name,
                })}
              </Button>
            </Link>
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-200">
            {t("team_summary", {
              name: character.name,
            })}
          </h2>
          <div className="">
            {characterTeams.teams.map((team: TeamData, index: number) => (
              <a
                href={`#team_${index}`}
                key={team.name}
                className="container card grid grid-cols-[350px_auto] gap-5 hover:bg-vulcan-700"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center text-lg">
                    <span className="text-sm">{t("team_rating")}</span>{" "}
                    <span
                      className={clsx("font-bold", {
                        "text-red-600": team.tier === "SS",
                        "text-amber-600": team.tier === "S",
                        "text-yellow-600": team.tier === "A",
                        "text-green-600": team.tier === "B",
                        "text-sky-600": team.tier === "C",
                      })}
                    >
                      {team.tier}
                    </span>
                  </div>
                  <h3 className="text-center text-lg font-semibold text-slate-100">
                    {team.name}
                  </h3>
                </div>
                <div className="relative flex gap-2">
                  {team.characters.map((char) => (
                    <Link
                      key={char.id + team.name}
                      className="group relative rounded-full border-4 border-vulcan-800 transition hover:border-vulcan-500"
                      href={`/${locale}/teams/${char.id}`}
                      title={`${characters[char.id].name} best team guide`}
                    >
                      <div
                        className={clsx(
                          "relative flex-none rounded-full",
                          `genshin-bg-rarity-${characters[char.id].rarity}`
                        )}
                      >
                        <img
                          className="rounded-full"
                          src={getUrl(
                            `/characters/${char.id}/image.png`,
                            100,
                            100
                          )}
                          alt={characters[char.id].name}
                          width={100}
                          height={100}
                        />
                        {char.c_min > 0 && (
                          <div className="absolute bottom-2 left-0 rounded-full bg-vulcan-700 p-1 text-xxs font-bold text-gray-300 group-hover:bg-vulcan-500 md:text-xs">
                            {`C${char.c_min}`}
                          </div>
                        )}
                        <ElementIcon
                          type={capitalize(char.element) || "Cryo"}
                          height={20}
                          width={20}
                          className="absolute inset-x-[37%] -bottom-2 z-40 rounded-full bg-vulcan-700 group-hover:bg-vulcan-500"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <div className="flex flex-col">
          {characterTeams.teams.map((team: TeamData, index: number) => (
            <Fragment key={team.name}>
              <div className="card" key={team.name}>
                <h2
                  id={`team_${index}`}
                  className="text-2xl font-semibold text-gray-200"
                >
                  {team.name} ({t("tier_num", { num: team.tier })})
                </h2>
                <p className="text-gray-300">{team.description}</p>
                <div className="mt-4 flex flex-col gap-2">
                  {team.characters.map((char) => (
                    <div
                      key={char.id}
                      className="container grid grid-cols-[120px_220px_auto] gap-5 border-b border-vulcan-600 py-4 last:border-b-0"
                    >
                      <div className="block aspect-square text-center">
                        <div className="font-bold text-slate-200">
                          {t({
                            id: char.role.toLowerCase(),
                            defaultMessage: char.role,
                          })}
                        </div>
                        <img
                          className="mx-auto mt-2 aspect-square rounded-full object-cover"
                          src={getUrl(
                            `/characters/${char.id}/image.png`,
                            100,
                            100
                          )}
                          alt={characters[char.id].name}
                          width={100}
                          height={100}
                        />
                        <h3 className="text-lg font-bold text-slate-200">
                          {characters[char.id].name}
                        </h3>
                        {char.c_min > 0 && (
                          <div className="my-1 rounded-full bg-vulcan-700 p-1 text-xxs font-bold text-gray-300 md:text-xs">
                            {t("constellation_num", {
                              num: char.c_min.toString(),
                            })}
                          </div>
                        )}
                        <ElementIcon
                          type={capitalize(char.element) || "Cryo"}
                          height={20}
                          width={20}
                          className="mx-auto"
                        />
                        <div className="text-xs">
                          {characters[char.id].element}
                        </div>
                      </div>
                      <div className="block aspect-square text-center">
                        <h4 className="text-center font-bold text-slate-200">
                          {t("char_role_build", {
                            name: characters[char.id].name,
                            role: t({
                              id: char.role.toLowerCase(),
                              defaultMessage: char.role,
                            }),
                          })}
                        </h4>
                        <div className="flex flex-col">
                          <h5 className="font-semibold text-slate-300">
                            {t("artifacts")}
                          </h5>
                          {char.artifacts.map((art) => (
                            <div key={art} className="text-center">
                              <h6 className="text-sm">
                                {artifactsMap[art].name}
                              </h6>
                              <img
                                src={getUrl(`/artifacts/${art}.png`)}
                                alt={artifactsMap[art].name}
                                width={36}
                                height={36}
                                className="mx-auto"
                              />
                            </div>
                          ))}
                          <div className="text-center text-slate-300">
                            {t("main_stats")}:
                          </div>
                          <div className="text-center text-sm">
                            <ul>
                              <li>
                                {t("sands")} {char.main_stats.sand.join(" / ")}
                              </li>
                              <li>
                                {t("goblet")}{" "}
                                {char.main_stats.globet.join(" / ")}
                              </li>
                              <li>
                                {t("circlet")}{" "}
                                {char.main_stats.circlet.join(" / ")}
                              </li>
                            </ul>
                          </div>
                          <div className="text-center text-slate-300">
                            {t("substats")}:
                          </div>
                          <div className="text-center text-sm">
                            {char.sub_stats.join(" / ")}
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col">
                          <h5 className="font-semibold text-slate-300">
                            {t("weapons")}
                          </h5>
                          {char.weapons.map((weapon) => (
                            <Link
                              key={weapon}
                              href={`/${locale}/weapon/${weapon}`}
                              className="text-center hover:text-white"
                            >
                              <h6 className="text-sm">
                                {weaponsMap[weapon].name}
                              </h6>
                              <img
                                src={getUrl(`/weapons/${weapon}.png`)}
                                alt={weapon}
                                width={36}
                                height={36}
                                className="mx-auto"
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="flex aspect-square items-center text-zinc-400">
                        {char.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {index === 1 ? (
                <FrstAds
                  placementName="genshinbuilds_incontent_3"
                  classList={["flex", "justify-center"]}
                />
              ) : null}
              {index === 2 ? (
                <FrstAds
                  placementName="genshinbuilds_incontent_4"
                  classList={["flex", "justify-center"]}
                />
              ) : null}
              {index === 3 ? (
                <FrstAds
                  placementName="genshinbuilds_incontent_5"
                  classList={["flex", "justify-center"]}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
      {characterTeams.teams.length <= 3 ? (
        <FrstAds
          placementName={`genshinbuilds_incontent_${characterTeams.teams.length + 2}`}
          classList={["flex", "justify-center"]}
        />
      ) : null}
    </div>
  );
}
