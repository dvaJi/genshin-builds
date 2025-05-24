import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import type { DiskDrives } from "@interfaces/zenless/diskDrives";
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
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.diskdrive",
  });
  const langData = getLangData(lang, "zenless");

  const item = await getZenlessData<DiskDrives>({
    resource: "disk-drives",
    filter: { id: slug },
    language: langData,
  });

  if (!item) {
    return;
  }

  const title = t("title", {
    itemname: item.name,
  });
  const description = t("description", {
    itemname: item.name,
  });
  const image = `/zenless/disk-drives/${item.icon}.webp`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return genPageMetadata({
    title,
    description,
    image: ogImage,
    path: `/zenless/disk-drives/${slug}`,
    locale: lang,
  });
}

export default async function DriskDriveDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.diskdrive");
  const langData = getLangData(lang, "zenless");
  const item = await getZenlessData<DiskDrives>({
    resource: "disk-drives",
    filter: { id: slug },
    language: langData,
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
            {t("disk_title", {
              item_name: item.name,
            })}
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

      <h2 className="text-2xl font-semibold">
        {t("item_effects", {
          item_name: item.name,
        })}
      </h2>
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
