import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import type { WEngines } from "@interfaces/zenless/wEngines";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { slug, lang } = await params;
  const item = await getZenlessData<WEngines>({
    resource: "w-engines",
    filter: { id: slug },
    language: lang,
  });

  if (!item) {
    return;
  }

  const title = `${item.name} Zenless Zone Zero W-Engine`;
  const description = `Learn about the ${item.name} W-Engine in Zenless Zone Zero. Find out everything you need to know about ${item.name} W-Engine, including stats, passive talents, and how to get it.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/w-engines/${item.icon}.webp`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/w-engines/${slug}`,
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

export default async function WEnginePage({ params }: Props) {
  const { lang, slug } = await params;
  const item = await getZenlessData<WEngines>({
    resource: "w-engines",
    filter: { id: slug },
    language: lang,
  });

  if (!item) {
    return notFound();
  }

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <div className="mx-2 mb-5 flex gap-4 md:mx-0">
        <Image
          src={`/w-engines/${item.icon}.webp`}
          width={200}
          height={200}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {item.name} W-Engine
          </h1>
          <div className="flex">
            {Array.from({ length: item.rarity }).map((_, i) => (
              <Image
                key={i}
                src="/icons/start.png"
                width={24}
                height={24}
                alt="Star"
              />
            ))}
          </div>
          <p dangerouslySetInnerHTML={{ __html: item.description }} />
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <h2 className="text-2xl font-semibold">{item.name} Refinements</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        <div className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2">
          <div>
            <h4 className="font-semibold">{item.talents[0].name}</h4>
            <p
              dangerouslySetInnerHTML={{ __html: item.talents[0].description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
