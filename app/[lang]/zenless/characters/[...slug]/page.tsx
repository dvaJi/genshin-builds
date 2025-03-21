import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import type { Builds } from "@interfaces/zenless/build";
import type { Characters } from "@interfaces/zenless/characters";
import type { Commons } from "@interfaces/zenless/commons";
import type { DiskDrives } from "@interfaces/zenless/diskDrives";
import type { WEngines } from "@interfaces/zenless/wEngines";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

import BuildsComponent from "./builds";
import Skill from "./skill";
import SkillPriority from "./skill-priority";
import TeamsComponent from "./teams";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
export const runtime = "edge";

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;
  const _slug = decodeURI(slug.join("/"));

  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.character",
  });
  const langData = getLangData(lang, "zenless");

  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: langData,
    filter: { id: _slug },
  });

  if (!character) {
    return;
  }

  const title = t("title", {
    characterName: character.fullname,
  });
  const description = t("description", {
    characterName: character.fullname,
  });
  const image = `/zenless/characters/portrait_${character.id}_2.webp`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return genPageMetadata({
    title,
    description,
    image: ogImage,
    path: `/zenless/characters/${_slug}`,
    locale: lang,
  });
}

export default async function CharactersPage({ params }: Props) {
  const { lang, slug: _slug } = await params;
  const slug = decodeURI(_slug.join("/"));
  setRequestLocale(lang);

  const t = await getTranslations("zenless.character");
  const langData = getLangData(lang, "zenless");
  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: langData,
    filter: { id: slug },
  });

  if (!character) {
    return notFound();
  }

  const build = await getZenlessData<Builds>({
    resource: "builds",
    filter: { id: slug },
  });

  const wEnginesMap =
    (await getZenlessData<Record<string, WEngines>>({
      resource: "w-engines",
      language: lang,
      select: ["id", "name", "icon", "rarity"],
      asMap: true,
    })) ?? {};

  const diskDrivesMap =
    (await getZenlessData<Record<string, DiskDrives>>({
      resource: "disk-drives",
      language: lang,
      select: ["id", "name", "icon"],
      asMap: true,
    })) ?? {};

  const charactersMap =
    (await getZenlessData<Record<string, Characters>>({
      resource: "characters",
      language: lang,
      select: ["id", "name"],
      asMap: true,
    })) ?? {};

  const bangboosMap =
    (await getZenlessData<Record<string, Bangboos>>({
      resource: "bangboos",
      language: lang,
      select: ["id", "name", "icon"],
      asMap: true,
    })) ?? {};

  const commons =
    (await getZenlessData<Commons>({
      resource: "commons",
      filter: { id: lang },
    })) ?? ({} as Commons);

  const finalTeams = build?.teams.filter((team) => {
    let isValid = true;

    // Remove duplicated teams names
    if (build?.teams?.filter((t) => t.name === team.name).length > 1) {
      return false;
    }

    // Remove teams with missing characters
    [1, 2, 3].forEach((i) => {
      const characterKey = `character_${i}` as
        | "character_1"
        | "character_2"
        | "character_3";
      if (!team[characterKey]) {
        isValid = false;
        return;
      }
      const charTeam = charactersMap[team[characterKey].name];
      if (!charTeam) {
        console.log("Character not found", characterKey, team[characterKey]);
        isValid = false;
      }
    });

    // Remove teams with missing bangboos
    team.bangboos.forEach((b) => {
      if (!bangboosMap[b]) {
        console.log("Bangboo not found", b);
        isValid = false;
      }
    });

    return isValid;
  });

  return (
    <div className="relative mx-2 max-w-screen-lg md:mx-auto">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row">
        <Image
          src={`/characters/portrait_${character.id}_2.webp`}
          width={200}
          height={200}
          alt={character.fullname}
          className="mx-auto w-48 sm:mx-0 sm:w-auto"
        />
        <div className="text-center sm:text-left">
          <h1 className="mb-2 text-3xl font-semibold md:text-5xl">
            {character.fullname} {t("title_suffix")}
          </h1>
          <div className="space-y-1 text-sm md:text-base">
            <p>
              <b>{t("rarity")}</b>:{" "}
              <Image
                src={`/icons/rank_${character.rarity}.png`}
                width={24}
                height={24}
                alt={character.rarity >= 4 ? "S" : "A"}
                className="inline"
              />{" "}
              {t("rank")}
            </p>
            <p>
              <b>{t("element")}</b>: {character.element}
            </p>
            <p>
              <b>{t("house")}</b>: {character.house}
            </p>
            <p>
              <b>{t("type")}</b>: {character.type}
            </p>
          </div>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      {build ? (
        <>
          <BuildsComponent
            lang={lang}
            characterName={character.fullname}
            builds={build.builds}
            commons={commons}
            diskDrivesMap={diskDrivesMap}
            wEnginesMap={wEnginesMap}
          />
          <FrstAds
            placementName="genshinbuilds_incontent_1"
            classList={["flex", "justify-center"]}
          />
          <TeamsComponent
            lang={lang}
            characterName={character.fullname}
            teams={finalTeams ?? []}
            charactersMap={charactersMap}
            bangboosMap={bangboosMap}
          />
          <FrstAds
            placementName="genshinbuilds_incontent_2"
            classList={["flex", "justify-center", "my-4"]}
          />
          <SkillPriority
            characterName={character.fullname}
            skillData={build.talentsPriority}
          />
        </>
      ) : null}

      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center", "my-4"]}
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold md:text-3xl">
          {character.name} {t("skills")}
        </h2>
        <div className="flex flex-col gap-2">
          {character.skills.map((skill) => (
            <Skill
              key={skill.name + skill.title}
              icon={`${skill.group?.toLowerCase()}.png`}
              name={skill.name}
              title={skill.title ?? ""}
              description={skill.description}
            />
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_4"
        classList={["flex", "justify-center", "my-4"]}
      />
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold md:text-3xl">
          {t("talents", {
            characterName: character.name,
          })}
        </h2>
        <div className="flex flex-col gap-2">
          {character.talents.map((talent) => (
            <Skill
              key={talent.name + talent.title}
              icon={`${talent.title?.toLowerCase()}.png`}
              name={talent.name}
              title={talent.title ?? ""}
              description={talent.description}
            />
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_5"
        classList={["flex", "justify-center", "my-4"]}
      />
    </div>
  );
}
