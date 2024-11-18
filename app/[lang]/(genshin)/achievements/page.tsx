import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import AchievementsWrapper from "./wrapper";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "achievements");
  const title = t({
    id: "title",
    defaultMessage: "Achievements",
  });
  const description = t({
    id: "description",
    defaultMessage: "Track your Genshin Impact achievement easily",
  });

  return genPageMetadata({
    title,
    description,
    path: `/achievements`,
    locale,
  });
}

export default async function GenshinTierlistWeapons({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "genshin",
    "achievements"
  );

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
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "achievements", defaultMessage: "Todo List" })}
      </h2>
      <AchievementsWrapper categories={categories} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
