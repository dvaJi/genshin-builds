import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { WEngines } from "@interfaces/zenless/wEngines";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const revalidate = 43200;
export const runtime = "edge";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.wengines",
  });

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/zenless/w-engines`,
    locale: lang,
  });
}

export default async function BangboosPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.bangboos");
  const langData = getLangData(lang, "zenless");
  const data = await getZenlessData<WEngines[]>({
    resource: "w-engines",
    language: langData,
    select: ["id", "name", "icon"],
  });
  return (
    <div className="relative z-0">
      <h1 className="text-4xl font-semibold">{t("w-engines")}</h1>
      <p>{t("w-engines-description")}</p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1 md:gap-4">
        {data?.map((item) => (
          <Link
            key={item.name}
            href={`/zenless/w-engines/${item.id}`}
            className="group relative items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
          >
            <div className="flex aspect-square h-40 items-center justify-center rounded-t bg-black group-hover:bg-[#fbfe00]">
              <Image
                className="max-w-max"
                src={`/w-engines/${item.icon}.webp`}
                alt={item.name}
                width={140}
                height={140}
              />
            </div>
            <div
              className="absolute bottom-0 flex h-7 w-full items-center justify-center"
              style={{
                background:
                  "repeating-linear-gradient( -45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 3px, rgba(60,60,60,0.5) 3px, rgba(60, 60, 60,0.5) 7px )",
              }}
            >
              <h2 className="font-bold text-white">{item.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
