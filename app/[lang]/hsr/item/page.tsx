import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Image from "@components/hsr/Image";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Items } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.items",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/item`,
    locale: lang,
  });
}

export default async function HSRItemPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.items");
  const langData = getLangData(lang, "hsr");

  const items = await getHSRData<Items[]>({
    resource: "items",
    language: langData,
    select: ["id", "name"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t("items")}
        </h2>
        <p className="px-4 text-sm">{t("items_desc")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <menu className="mx-4 mt-2 grid grid-cols-3 gap-4 md:grid-cols-4 lg:mx-0 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/hsr/item/${item.id}`}
            className="group/link grid justify-center justify-items-center border border-border bg-card text-center ring-primary hover:bg-muted hover:ring-2"
          >
            <Image
              className="h-[128px] w-[128px]"
              src={`/items/${item.id}.png`}
              width={128}
              height={128}
              alt={item.name}
            />
            <h3
              className="px-1 pb-3 leading-5 group-hover/link:text-secondary-foreground"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
          </Link>
        ))}
      </menu>
    </div>
  );
}
