import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import LeaderboardWrapper from "./wrapper";

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
    namespace: "Genshin.leaderboard",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/leaderboard`,
    locale: lang,
  });
}

export default async function GenshinTierlistWeapons({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.leaderboard");
  const langData = getLangData(lang, "genshin");

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["_id", "id", "name"],
  });

  return (
    <div className="w-full">
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t("leaderboard")}
      </h2>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="py-4 text-center">
        <Link
          href={`/profile`}
          className="text-lg font-semibold hover:text-white"
        >
          {t("submit_uid")}
        </Link>
      </div>
      <div className="text-center text-sm">
        {t("section_still_in_development")}
      </div>
      <LeaderboardWrapper characters={characters} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
