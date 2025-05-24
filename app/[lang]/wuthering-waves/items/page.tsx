import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Items } from "@interfaces/wuthering-waves/items";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";
export const revalidate = 86400;
export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "WW.items",
  });

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves/items`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("WW.items");
  const langData = getLangData(lang, "wuthering-waves");

  const items = await getWWData<Items[]>({
    resource: "items",
    language: langData,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="flex flex-wrap justify-center gap-10 rounded border border-zinc-800 bg-zinc-900 p-4">
        {items?.map((item) => (
          <Link
            key={item.id}
            href={`/wuthering-waves/items/${item.id}`}
            className="flex h-24 w-24 flex-col items-center transition-all hover:brightness-125"
          >
            <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border border-ww-900 bg-ww-950">
              <Image
                className=""
                src={`/items/${item.icon}.webp`}
                alt={item.name ?? ""}
                width={96}
                height={96}
              />
            </div>
            <h3 className="text-center text-sm leading-5">{item.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
