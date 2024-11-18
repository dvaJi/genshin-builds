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

  const title = `${bangboo.name} Zenless Zone Zero`;
  const description = `Learn about the ${bangboo.name} Bangboo in Zenless Zone Zero. Also included are their skills, upgrade costs, and more.`;
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
    <div className="relative mx-auto max-w-screen-lg">
      <div className="mx-2 mb-5 flex gap-4 md:mx-0">
        <Image
          src={`/bangboos/${bangboo.icon}.webp`}
          width={200}
          height={200}
          alt={bangboo.name}
        />
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {bangboo.name} Bangboo
          </h1>
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
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <h2 className="text-2xl font-semibold">{bangboo.name} Skills</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        {Object.values(bangboo.skills).map((skill, i) => (
          <div
            key={skill.name}
            className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
              <Image
                className="mr-2 h-12 w-12"
                src={`/icons/bangboo_${i === 0 ? "a" : i === 1 ? "b" : "c"}.png`}
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
