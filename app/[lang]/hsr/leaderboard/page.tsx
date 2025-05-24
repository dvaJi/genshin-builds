import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import LeaderboardWrapper from "./wrapper";

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
    namespace: "HSR.leaderboard",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/leaderboard`,
    locale: lang,
  });
}

export default async function HSRLeaderboard({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.leaderboard");
  // const langData = getLangData(lang, "hsr");

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-semibold text-gray-200">
          {t("leaderboard")}
        </h2>
        <Link
          href={`/hsr/showcase`}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <PlusIcon className="h-4 w-4" />
          {t("submit_uid")}
        </Link>
      </div>
      <p className="mb-4 text-sm text-gray-400">{t("leaderboard_desc")}</p>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <LeaderboardWrapper />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
