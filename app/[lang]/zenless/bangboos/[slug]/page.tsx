import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import Image from "@components/zenless/Image";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Bangboos[]>("zenless", "bangboos");

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: c.id,
      }))
    );
  }

  return routes;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const slug = params.slug;
  const data = await getRemoteData<Bangboos[]>("zenless", "bangboos");
  const character = data.find((c) => c.id === slug);

  if (!character) {
    return;
  }

  const title = `${character.name} Zenless Zone Zero`;
  const description = `Learn about the ${character.name} Bangboo in Zenless Zone Zero. Also included are their skills, upgrade costs, and more.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/bangboos/${character.id}.png`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/bangboos/${slug}`,
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

export default async function BangbooPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const data = await getRemoteData<Bangboos[]>("zenless", "bangboos");

  const bangboo = data.find((c) => c.id === slug);

  if (!bangboo) {
    return notFound();
  }

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <div className="mx-2 mb-5 flex gap-4 md:mx-0">
        <Image
          src={`/bangboos/${bangboo.id}.png`}
          width={200}
          height={200}
          alt={bangboo.name}
        />
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {bangboo.name} Bangboo
          </h1>
          <p>
            <b>Rarity</b>: {bangboo.rarity}
          </p>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <h2 className="text-2xl font-semibold">{bangboo.name} Skills</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        {bangboo.skills.map((skill) => (
          <div
            key={skill.name}
            className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
              <Image
                className="mr-2 h-12 w-12"
                src={`/icons/bangboo_${skill.type?.toLowerCase()}.png`}
                alt={skill.name}
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="flex">
                <h4 className="font-semibold">{skill.name}</h4>
              </div>
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: skill.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
