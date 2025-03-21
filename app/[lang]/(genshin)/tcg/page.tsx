import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { TCGCard } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import CardsTable from "./table";

export const dynamic = "force-static";
export const runtime = "edge";

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
    namespace: "Genshin.tcg_cards",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/tcg`,
    locale: lang,
  });
}

export default async function GenshinTCG({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.tcg_cards");
  const langData = getLangData(lang, "genshin");

  const cards = await getGenshinData<TCGCard[]>({
    resource: "tcgCards",
    language: langData,
    select: ["name", "id", "attributes"],
  });

  const types = cards
    .map((card) => card?.attributes?.card_type)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("cards")}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Ads className="hidden md:block" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-8">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
      </div>

      <div className="card">
        <CardsTable cards={cards} types={types} />
      </div>

      <div className="mt-8">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
