import clsx from "clsx";
import { TeamData } from "interfaces/teams";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Fragment } from "react";

import { Badge } from "@app/components/ui/badge";
import { Separator } from "@app/components/ui/separator";
import { genPageMetadata } from "@app/seo";
import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import GoTo from "@components/go-to";
import Ads from "@components/ui/Ads";
import Button from "@components/ui/Button";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import type { Beta, Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinCharacterTeams, getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";
import { capitalize } from "@utils/capitalize";

import { CharacterCard } from "./character-card";

type Props = {
  params: Promise<{ lang: string; character: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, character: characterParams } = await params;

  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.teams",
  });
  const langData = getLangData(lang, "genshin");

  const beta = await getData<Beta>("genshin", "beta");
  const _character = await getGenshinData<Character>({
    resource: "characters",
    language: langData as any,
    select: ["id", "name"],
    filter: {
      id: characterParams,
    },
  });
  const _betaCharacter = beta[lang]?.characters?.find(
    (c: any) => c.id === characterParams,
  );

  const character = _character || _betaCharacter;

  if (!character) {
    return;
  }

  const title = t("detail_title", { name: character.name });
  const description = t("detail_description", { name: character.name });

  return genPageMetadata({
    title,
    description,
    path: `/teams/${characterParams}`,
    locale: lang,
  });
}

export default async function GenshinCharacterTeams({ params }: Props) {
  const { lang, character: characterParams } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.teams");
  const langData = getLangData(lang, "genshin");

  const detail = await getGenshinCharacterTeams(characterParams, langData);

  if (!detail || (detail as any).error) {
    return redirect(`/${lang}/teams`);
  }

  const character = detail.charactersMap[characterParams];

  const tierBadge = {
    SS: {
      text: "text-red-600",
      bg: "bg-red-900/50",
    },
    S: {
      text: "text-amber-600",
      bg: "bg-amber-900/50",
    },
    A: {
      text: "text-yellow-600",
      bg: "bg-yellow-900/50",
    },
    B: {
      text: "text-green-600",
      bg: "bg-green-900/50",
    },
    C: {
      text: "text-sky-600",
      bg: "bg-sky-900/50",
    },
  };

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="mx-2 md:mx-0">
        <h1 className="mr-2 scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
          {t("detail_character", {
            name: character.name,
          })}
        </h1>
        <div className="card mb-6">
          <div className="mb-4 flex w-full">
            <div
              className={clsx(
                "relative mr-4 h-[100px] w-[100px] flex-none shrink-0 overflow-hidden rounded-xl object-cover",
                `genshin-bg-rarity-${character.rarity}`,
              )}
            >
              <Image
                src={`/characters/${character.id}/image.png`}
                alt={character.name}
                width={100}
                height={100}
              />
            </div>

            <p
              className="text-card-foreground"
              dangerouslySetInnerHTML={{ __html: detail.overview }}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Link href={`/character/${characterParams}`}>
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
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
            {t("team_summary", {
              name: character.name,
            })}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {detail.teams.map((team: TeamData, index: number) => (
              <GoTo
                elementId={`#team_${index + 1}`}
                key={team.name + team.characters.map((c) => c.id).join("")}
                className="container card flex flex-col items-center gap-5 transition hover:text-accent hover:ring-4 hover:ring-accent md:flex-row"
              >
                <div className="flex flex-col items-center md:w-[49%]">
                  <div className="">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <Badge
                      variant="secondary"
                      className={`ml-2 ${tierBadge[team.tier as keyof typeof tierBadge].bg} ${tierBadge[team.tier as keyof typeof tierBadge].text}`}
                    >
                      {t("team_rating")} {team.tier}
                    </Badge>
                  </div>
                  <h3 className="text-center text-lg font-semibold">
                    {team.name}
                  </h3>
                </div>
                <div className="relative grid grid-cols-2 gap-2 md:flex md:w-[50%]">
                  {team.characters.map((char) => (
                    <Link
                      key={char.id + team.name}
                      className="group relative rounded-full border-4 border-accent-foreground transition hover:border-primary"
                      href={`/teams/${char.id}`}
                      title={`${detail.charactersMap[char.id].name} best team guide`}
                    >
                      <div
                        className={clsx(
                          "relative flex-none rounded-full",
                          `genshin-bg-rarity-${detail.charactersMap[char.id].rarity}`,
                        )}
                      >
                        <Image
                          className="rounded-full object-cover"
                          src={`/characters/${char.id}/image.png`}
                          alt={detail.charactersMap[char.id].name}
                          width={60}
                          height={60}
                        />
                        {char.c_min > 0 && (
                          <div className="absolute bottom-2 left-0 rounded-full bg-muted p-1 text-xxs font-bold text-gray-300 group-hover:bg-accent md:text-xs">
                            {`C${char.c_min}`}
                          </div>
                        )}
                      </div>
                      <ElementIcon
                        type={capitalize(char.element) || "Cryo"}
                        height={20}
                        width={20}
                        className="absolute -bottom-2 left-1/2 z-40 -translate-x-1/2 rounded-full bg-muted group-hover:bg-accent"
                      />
                    </Link>
                  ))}
                </div>
              </GoTo>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <Separator className="my-4" />
        <div className="flex flex-col gap-6">
          {detail.teams.map((team: TeamData, index: number) => (
            <Fragment
              key={team.name + team.characters.map((c) => c.id).join("")}
            >
              <div>
                <div className="flex items-center gap-4">
                  <h2
                    id={`team_${index + 1}`}
                    className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0"
                  >
                    #{index + 1} {team.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className={`${tierBadge[team.tier as keyof typeof tierBadge].bg} ${tierBadge[team.tier as keyof typeof tierBadge].text}`}
                  >
                    {t("tier_num", { num: team.tier })}
                  </Badge>
                </div>
                <p
                  className="text-secondary-foreground"
                  dangerouslySetInnerHTML={{ __html: team.description ?? "" }}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {team.characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    characterTeam={char}
                    character={detail.charactersMap[char.id]}
                    artifactsMap={detail.artifactsMap}
                    weaponsMap={detail.weaponsMap}
                  />
                ))}
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
              {index > 2 ? (
                <FrstAds
                  placementName="genshinbuilds_incontent_5"
                  classList={["flex", "justify-center"]}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_5"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
