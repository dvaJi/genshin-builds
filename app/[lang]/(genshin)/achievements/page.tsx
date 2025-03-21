import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import AchievementsWrapper from "./wrapper";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";
export const runtime = "edge";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.achievements",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/achievements`,
    locale: lang,
  });
}

export default async function GenshinTierlistWeapons({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.achievements");
  const langData = getLangData(lang, "genshin");

  const categories = await getGenshinData<any[]>({
    resource: "achievements",
    language: langData,
  });

  return (
    <div className="w-full">
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
            {t("achievements")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="">
          <AchievementsWrapper categories={categories} />
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
