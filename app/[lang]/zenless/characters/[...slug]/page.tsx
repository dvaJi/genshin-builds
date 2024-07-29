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
  params: { slug: string[] };
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join("/"));

  const character = await getZenlessData<Characters>({
    resource: "characters",
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
  params: { slug: string[] };
}) {
  const slug = decodeURI(params.slug.join("/"));
  const character = await getZenlessData<Characters>({
    resource: "characters",
    filter: { id: slug },
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
            <b>Rarity</b>: {character.rarity}
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
      <div className="mx-2 mb-4 rounded-lg border-2 border-zinc-950 bg-zinc-100 p-4 md:mx-0">
        <h2 className="font-semibold">{character.name} Upgrade Materials</h2>
        <div className="pb-2 italic">TBD</div>

        <h2 className="font-semibold">
          {character.name} Best Disk Drives Gear Sets
        </h2>
        <div className="pb-2 italic">TBD</div>

        <h2 className="font-semibold">
          {character.name} Best W-Engines Weapons
        </h2>
        <div className="pb-2 italic">TBD</div>

        <h2 className="font-semibold">{character.name} Best Stats</h2>
        <div className="pb-2 italic">TBD</div>

        <h2 className="font-semibold">{character.name} Best Substats</h2>
        <div className="italic">TBD</div>
      </div>
      <h2 className="text-2xl font-semibold">{character.name} Skills</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        {character.skills
          .filter((s) => s.group !== "Talent")
          .map((skill) => (
            <div
              key={skill.name}
              className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2"
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
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: skill.description
                      .replaceAll("color: #ffffff", "font-weight: bold")
                      .replaceAll("\\\\n", "<br>"),
                  }}
                />
              </div>
            </div>
          ))}
      </div>

      <h2 className="text-2xl font-semibold">{character.name} Talents</h2>
      <div className="mx-2 flex flex-col gap-2 md:mx-0">
        {character.skills
          .filter((s) => s.group === "Talent")
          .map((skill) => (
            <div
              key={skill.name}
              className="flex rounded-lg border-2 border-zinc-950 p-2"
            >
              <div className="flex w-[120px] min-w-[120px] flex-col items-center">
                <div className="flex items-center justify-center rounded-full border-2 border-zinc-950 bg-black/50 p-1">
                  <Image
                    className="h-12 w-12"
                    src={`/icons/${skill.title?.toLowerCase()}.png`}
                    alt={skill.name}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-center font-semibold">{skill.title}</h3>
              </div>
              <div>
                <div className="flex">
                  <h4 className="font-semibold">{skill.name}</h4>
                </div>
                <p
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: skill.description.replaceAll(
                      "color: #ffffff",
                      "font-weight: bold"
                    ),
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
