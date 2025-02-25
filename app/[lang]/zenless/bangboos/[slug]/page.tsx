import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;

  const bangboo = await getZenlessData<Bangboos>({
    resource: "bangboos",
    filter: { id: slug },
    language: lang,
  });

  if (!bangboo) {
    return;
  }

  const title = `${bangboo.name} - Zenless Zone Zero (ZZZ) Bangboo Guide`;
  const description = `Learn all about ${bangboo.name} Bangboo in Zenless Zone Zero (ZZZ). View detailed skill descriptions and how to use this Bangboo effectively.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/bangboos/${bangboo.icon}.webp`;

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

export default async function BangbooPage({ params }: Props) {
  const { lang, slug } = await params;
  const bangboo = await getZenlessData<Bangboos>({
    resource: "bangboos",
    filter: { id: slug },
    language: lang,
  });

  if (!bangboo) {
    return notFound();
  }

  return (
    <div className="mx-2 max-w-screen-lg md:mx-auto">
      <div className="mb-5 flex flex-col sm:flex-row gap-4">
        <Image
          src={`/bangboos/${bangboo.icon}.webp`}
          width={200}
          height={200}
          alt={bangboo.name}
          className="mx-auto sm:mx-0 w-48 sm:w-auto"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl md:text-5xl font-semibold mb-2">
            {bangboo.name} - ZZZ Bangboo Guide
          </h1>
          <div className="space-y-1 text-sm md:text-base">
            <p>
              <b>Rarity</b>:{" "}
              <Image
                src={`/icons/rank_${bangboo.rarity}.png`}
                width={24}
                height={24}
                alt={bangboo.rarity >= 4 ? "S" : "A"}
                className="inline"
              />{" "}
              Rank
            </p>
          </div>
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mt-4 md:mt-6 space-y-4">
        {Object.values(bangboo.skills).map((skill, i) => (
          <div
            key={skill.name + i}
            className="flex flex-col sm:flex-row gap-4 rounded-lg border-2 border-zinc-950 p-3 md:p-4"
          >
            <div className="flex sm:w-[120px] sm:min-w-[120px] flex-row sm:flex-col items-center gap-2">
              <Image
                className="h-10 w-10 sm:h-12 sm:w-12"
                src={`/icons/bangboo_${i === 0 ? "a" : i === 1 ? "b" : "c"}.png`}
                alt={skill.name}
                width={48}
                height={48}
              />
              <h4 className="text-sm md:text-base font-semibold">{skill.name}</h4>
            </div>
            <div className="flex-1">
              <p
                className="whitespace-pre-line text-sm md:text-base text-neutral-200"
                dangerouslySetInnerHTML={{ __html: skill.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
