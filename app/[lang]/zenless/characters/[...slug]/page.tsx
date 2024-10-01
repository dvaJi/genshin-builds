import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import Image from "@components/zenless/Image";
import type { Characters } from "@interfaces/zenless/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string[] }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getZenlessData<Characters[]>({
      resource: "characters",
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

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string[] };
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join("/"));

  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: params.lang,
    filter: { id: slug },
  });

  if (!character) {
    return;
  }

  const title = `${character.name} Zenless Zone Zero (ZZZ) Build Guide`;
  const description = `Discover the best builds and teams for ${character.name} in Zenless Zone Zero (ZZZ). Also included are their skills, upgrade costs, and more.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/characters/portrait_${character.id}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/characters/${slug}`,
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

export default async function CharactersPage({
  params,
}: {
  params: { lang: string; slug: string[] };
}) {
  const slug = decodeURI(params.slug.join("/"));
  const character = await getZenlessData<Characters>({
    resource: "characters",
    language: params.lang,
    filter: { id: slug },
    revalidate: 0,
  });

  if (!character) {
    return notFound();
  }

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <div className="mx-2 mb-5 flex gap-4 md:mx-0">
        <Image
          src={`/characters/portrait_${character.id}.png`}
          width={200}
          height={200}
          alt={character.name}
        />
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {character.name} Build
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
      <h2 className="text-2xl font-semibold">{character.name} Skills</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        {character.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex gap-2 rounded-lg border-2 border-neutral-600 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
              <Image
                className="mr-2 h-12 w-12"
                src={`/icons/${skill.group?.toLowerCase()}.png`}
                alt={skill.name}
                width={48}
                height={48}
              />
              <h3 className="text-center font-semibold">{skill.title}</h3>
            </div>
            <div>
              <div className="flex">
                <h4 className="font-semibold">{skill.name}</h4>
              </div>
              <p
                className="character__skill-description whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: skill.description
                    .replaceAll("color: #FFFFFF", "font-weight: bold")
                    .replaceAll("color: #98EFF0", "color: #60abac")
                    .replaceAll("\\\\n", "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold">{character.name} Talents</h2>
      <div className="mx-2 flex flex-col gap-2 md:mx-0">
        {character.talents.map((talent) => (
          <div
            key={talent.name}
            className="flex rounded-lg border-2 border-neutral-600 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center">
              <div className="flex items-center justify-center rounded-full border-2 border-zinc-950 bg-black/50 p-1">
                <Image
                  className="h-12 w-12"
                  src={`/icons/${talent.title?.toLowerCase()}.png`}
                  alt={talent.name}
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="text-center font-semibold">{talent.title}</h3>
            </div>
            <div>
              <div className="flex">
                <h4 className="font-semibold">{talent.name}</h4>
              </div>
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: talent.description
                    .replaceAll("color: #FFFFFF", "font-weight: bold")
                    .replaceAll("color: #98EFF0", "color: #60abac"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
