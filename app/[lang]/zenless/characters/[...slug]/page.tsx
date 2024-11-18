import { i18n } from "i18n-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
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
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string[] }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getZenlessData<Characters[]>({
      resource: "characters",
      select: ["id"],
    });

    if (!data) continue;

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: [c.id],
      }))
    );
  }

  return routes;
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

  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: lang,
    filter: { id: _slug },
  });

  if (!character) {
    return;
  }

  const title = `${character.fullname} Zenless Zone Zero (ZZZ) Build Guide`;
  const description = `Discover the best builds and teams for ${character.fullname} in Zenless Zone Zero (ZZZ). Also included are their skills, upgrade costs, and more.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/characters/portrait_${character.id}_2.webp`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/characters/${_slug}`,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CharactersPage({ params }: Props) {
  const { lang, slug: _slug } = await params;
  const slug = decodeURI(_slug.join("/"));
  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: lang,
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

  return (
    <div className="relative mx-2 max-w-screen-lg md:mx-auto">
      <div className="mb-5 flex gap-4">
        <Image
          src={`/characters/portrait_${character.id}_2.webp`}
          width={200}
          height={200}
          alt={character.fullname}
        />
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {character.fullname} Build
          </h1>
          <p>
            <b>Rarity</b>:{" "}
            <Image
              src={`/icons/rank_${character.rarity}.png`}
              width={24}
              height={24}
              alt={character.rarity >= 4 ? "S" : "A"}
              className="inline"
            />{" "}
            Rank
          </p>
          <p>
            <b>Element</b>: {character.element}
          </p>
          <p>
            <b>House</b>: {character.house}
          </p>
          <p>
            <b>Type</b>: {character.type}
          </p>
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
            teams={build.teams}
            charactersMap={charactersMap}
            bangboosMap={bangboosMap}
          />
          <FrstAds
            placementName="genshinbuilds_incontent_2"
            classList={["flex", "justify-center"]}
          />
          <SkillPriority
            characterName={character.fullname}
            skillData={build.talentsPriority}
          />
        </>
      ) : null}

      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">{character.name} Skills</h2>
      <div className="mb-4 flex flex-col gap-2">
        {character.skills.map((skill) => (
          <Skill
            key={skill.name}
            icon={`${skill.group?.toLowerCase()}.png`}
            name={skill.name}
            title={skill.title ?? ""}
            description={skill.description}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_4"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">{character.name} Talents</h2>
      <div className="flex flex-col gap-2">
        {character.talents.map((talent) => (
          <Skill
            key={talent.name}
            icon={`${talent.title?.toLowerCase()}.png`}
            name={talent.name}
            title={talent.title ?? ""}
            description={talent.description}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_5"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
