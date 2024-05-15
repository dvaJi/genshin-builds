import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import LeaderboardWrapper from "./wrapper";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "leaderboard"
  );
  const title = t({
    id: "title",
    defaultMessage: "Leaderboard",
  });
  const description = t({
    id: "description",
    defaultMessage: "See the top builds from the community.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/leaderboard`,
    locale,
  });
}

export default async function GenshinTierlistWeapons({ params }: Props) {
  const { t, langData, locale } = await useTranslations(
    params.lang,
    "genshin",
    "leaderboard"
  );

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["_id", "id", "name"],
  });

  return (
    <div className="w-full">
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({
          id: "leaderboard",
          defaultMessage: "Leaderboard - Top Builds from the Community",
        })}
      </h2>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="py-4 text-center">
        <Link
          href={`/${params.lang}/profile`}
          className="text-lg font-semibold hover:text-white"
          prefetch={false}
        >
          Submit your UID here!
        </Link>
      </div>
      <div className="text-center text-sm">
        This section is still in development.
      </div>
      <LeaderboardWrapper characters={characters} locale={locale} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
