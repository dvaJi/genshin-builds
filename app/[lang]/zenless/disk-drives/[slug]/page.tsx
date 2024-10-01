import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import Image from "@components/zenless/Image";
import type { DiskDrives } from "@interfaces/zenless/diskDrives";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata | undefined> {
  const slug = params.slug;
  const item = await getZenlessData<DiskDrives>({
    resource: "disk-drives",
    filter: { id: slug },
    language: params.lang,
  });

  if (!item) {
    return;
  }

  const title = `${item.name} Zenless Zone Zero`;
  const description = `Learn about the ${item.name} Disk Drive in Zenless Zone Zero (ZZZ), including effects, how to obtain, and more.`;
  const publishedTime = new Date().toISOString();
  const image = `/zenless/disk-drives/${item.id}.png`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/disk-drives/${slug}`,
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

export default async function DriskDriveDetailPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const slug = params.slug;
  const item = await getZenlessData<DiskDrives>({
    resource: "disk-drives",
    filter: { id: slug },
    language: params.lang,
  });

  if (!item) {
    return notFound();
  }

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <div className="mx-2 mb-5 flex gap-4 md:mx-0">
        <div className="h-40 w-40 flex-shrink-0">
          <Image
            src={`/disk-drives/${item.icon}.webp`}
            width={156}
            height={156}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold md:text-5xl">
            Zenless Zone Zero (ZZZ) {item.name} Disk Drive
          </h1>
          <p className="text-sm text-neutral-300">{item.filter}</p>
          <p className="text-sm">{item.story}</p>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <h2 className="text-2xl font-semibold">{item.name} Effects</h2>
      <div className="mx-2 mb-4 flex flex-col gap-2 md:mx-0">
        <div className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2">
          <div>
            <div className="flex">
              <h4 className="font-semibold">2 PC</h4>
            </div>
            <p
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: item.set2 }}
            />
          </div>
        </div>
        <div className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2">
          <div>
            <div className="flex">
              <h4 className="font-semibold">4 PC</h4>
            </div>
            <p
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: item.set4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
