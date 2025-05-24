import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const revalidate = 43200;
export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.bangboos",
  });

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/zenless/bangboos`,
    locale: lang,
  });
}

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function BangboosPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.bangboos");
  const langData = getLangData(lang, "zenless");
  const data = await getZenlessData<Bangboos[]>({
    resource: "bangboos",
    language: langData,
    select: ["id", "name", "icon"],
  });
  return (
    <div className="px-4 md:px-0">
      <div className="my-4 md:my-6">
        <h1 className="mb-2 text-3xl font-semibold md:text-4xl">
          {t("bangboos")}
        </h1>
        <p className="text-sm text-neutral-200 md:text-base">
          {t("bangboos_description")}
        </p>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-6 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {data?.map((bangboo) => (
          <Link
            key={bangboo.name}
            href={`/zenless/bangboos/${bangboo.id}`}
            className="group relative items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
          >
            <div className="flex aspect-square h-auto items-center justify-center rounded-t bg-black group-hover:bg-[#fbfe00] md:h-40">
              <Image
                className="max-w-max"
                src={`/bangboos/${bangboo.icon}.webp`}
                alt={bangboo.name}
                width={200}
                height={200}
              />
            </div>
            <div
              className="absolute bottom-0 flex h-6 w-full items-center justify-center md:h-7"
              style={{
                background:
                  "repeating-linear-gradient( -45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 3px, rgba(60,60,60,0.5) 3px, rgba(60, 60, 60,0.5) 7px )",
              }}
            >
              <h2 className="truncate px-2 text-sm font-bold text-white md:text-base">
                {bangboo.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
