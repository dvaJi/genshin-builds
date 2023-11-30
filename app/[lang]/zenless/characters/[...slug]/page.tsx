import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getImg } from "@lib/imgUrl";
import { getRemoteData } from "@lib/localData";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Character = {
  id: string;
  name: string;
  element: string;
  attack: string;
  faction: string;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  const routes: { lang: string; slug: string[] }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Character[]>("zenless", "characters");

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
  const data = await getRemoteData<Character[]>("zenless", "characters");
  const character = data.find((c) => c.id === slug);

  if (!character) {
    return;
  }

  const title = `${character.name} in Zenless Zone Zero: The Ultimate Build Guide`;
  const description = `Enhance your Zenless Zone Zero experience with the ultimate builds and top-performing teams for ${character.name}. Unlock in-depth information on their skills, upgrade costs, and much more. Explore now and optimize your gameplay like never before.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/characters/${character.id}/splash.png`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

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
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CharactersPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = decodeURI(params.slug.join("/"));
  const data = await getRemoteData<Character[]>("zenless", "characters");

  const character = data.find((c) => c.id === slug);

  if (!character) {
    return notFound();
  }

  return (
    <div
      className="h-screen bg-contain bg-right bg-no-repeat"
      style={{
        backgroundImage: `url('${getImg(
          "zenless",
          `/characters/${character.id}/splash.png`
        )}')`,
      }}
    >
      <h1 className="text-6xl font-semibold">
        {character.name}{" "}
        <img
          className="inline"
          src={getImg("zenless", `/icons/${character.attack}.webp`)}
          alt={character.attack}
        />
        <img
          className="ml-2 inline"
          src={getImg("zenless", `/icons/${character.element}.webp`)}
          alt={character.element}
        />
      </h1>
      <div className="flex h-24 gap-4">
        <img
          src={getImg("zenless", `/icons/${character.faction}.png`)}
          alt={character.faction}
        />
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div
        className="mt-8 flex w-96 flex-wrap items-center justify-center rounded border-4 border-zinc-950 p-6 font-semibold text-white ring-4 ring-white"
        style={{
          background:
            "repeating-linear-gradient( -45deg, rgba(0,0,0,0.8), rgba(0,0,0,0.8) 3px, rgba(22,22,22,0.6) 3px, rgba(22, 22, 22,0.6) 8px )",
        }}
      >
        More info about {character.name} soon.
      </div>
    </div>
  );
}
