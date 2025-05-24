import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Achievement } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";

import List from "./list";

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
    namespace: "HSR.achievements",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/achievements`,
    locale: lang,
  });
}

export default async function HSRAchievementsPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.achievements");
  const langData = getLangData(lang, "hsr");

  const achievements = await getHSRData<Achievement[]>({
    resource: "achievements",
    language: langData,
  });

  const rewardValue = {
    Low: 5,
    Mid: 10,
    High: 20,
  };

  const allSeriesText = [
    ...new Set(
      achievements.map((a) => a.seriesText).filter((a) => a !== undefined),
    ),
  ];
  const categories = allSeriesText
    .map((name) => {
      const a = achievements.filter((a) => a.seriesText === name);
      const nonDuplicate = [...new Set(a.map((a) => a._id))];

      return {
        id: a[0].seriesId,
        name,
        achievements: nonDuplicate.map((id) => ({
          _id: id,
          r: rewardValue[a.find((a) => a._id === id)?.rarity || "Low"],
        })),
      };
    })
    .sort((a, b) => a.id - b.id);
  const achievementsMap = achievements.reduce(
    (a, b) => {
      a[b._id] = b;
      return a;
    },
    {} as Record<number, Achievement>,
  );

  return (
    <div>
      <div className="my-2">
        <h2 className="text-3xl font-semibold uppercase text-slate-100">
          {t("achievements")}
        </h2>
        <p className="px-4 text-sm">{t("achievements_desc")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <List
        achievements={achievementsMap}
        categories={categories}
        rewardValue={rewardValue}
      />
    </div>
  );
}
