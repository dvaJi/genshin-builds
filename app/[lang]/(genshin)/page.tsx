import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";

import { genPageMetadata } from "@app/seo";
import ServerTimers from "@components/ServerTimers";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type { Character, Domains, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import { Banners } from "./banners";
import FarmableToday from "./farmable-today";
import { LatestPosts } from "./latest-posts";
import Shortcuts from "./shortcuts";


// Loading components with improved visual design
const LoadingCard = () => (
  <div className="relative h-[280px] w-full animate-pulse overflow-hidden rounded-xl bg-card/90 p-4 sm:h-64 sm:p-6">
    <div className="h-28 w-full rounded-lg bg-muted/50 sm:h-32" />
    <div className="mt-3 h-4 w-2/3 rounded bg-muted/50 sm:mt-4" />
    <div className="mt-2 h-4 w-1/3 rounded bg-muted/50" />
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
    <LoadingCard />
    <LoadingCard />
    <LoadingCard />
  </div>
);

// Ad component with improved loading state
const SuspenseAd = ({
  placementName,
  classList,
}: {
  placementName: string;
  classList?: string[];
}) => (
  <Suspense
    fallback={
      <div className="h-24 w-full animate-pulse rounded-lg bg-card/50 backdrop-blur-sm" />
    }
  >
    <FrstAds placementName={placementName} classList={classList} />
  </Suspense>
);

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.ascension_planner",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/`,
    locale: lang,
  });
}

async function getData(langData: string) {
  // Fetch data in parallel
  const [domains, charactersMap, weaponsMap] = await Promise.all([
    getGenshinData<Domains>({
      resource: "domains",
      language: langData,
    }),
    getGenshinData<Record<string, Character>>({
      resource: "characters",
      select: ["id", "name", "rarity"],
      asMap: true,
    }),
    getGenshinData<Record<string, Weapon>>({
      resource: "weapons",
      select: ["id", "name", "rarity"],
      asMap: true,
    }),
  ]);

  return { domains, charactersMap, weaponsMap };
}

export default async function IndexPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const langData = getLangData(lang, "genshin");
  const t = await getTranslations("Genshin.ascension_planner");

  const { domains, charactersMap, weaponsMap } = await getData(langData);
  const days = domains.characters[0].rotation.map((r) => r.day);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-xl bg-card/95 p-4 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(255,255,255,0.08)_0%,_transparent_50%)]" />
        <div className="relative">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            {t("welcome_title")}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
            {t("welcome_desc")}
          </p>
        </div>
      </div>

      <SuspenseAd
        placementName="genshinbuilds_billboard_atf"
        classList={["mt-6 sm:mt-8 flex justify-center"]}
      />

      {/* Shortcuts Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl">
          {t("shortcuts")}
        </h2>
        <Shortcuts />
      </section>

      {/* Banners Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0 sm:text-3xl">
          {t("banners")}
        </h2>
        <p className="mb-4 text-base text-slate-300 sm:mb-6 sm:text-lg">
          {t("banners_desc")}
        </p>
        <Suspense fallback={<LoadingGrid />}>
          <Banners lang={lang} />
        </Suspense>
      </section>

      <SuspenseAd
        placementName="genshinbuilds_incontent_1"
        classList={["mt-8 sm:mt-12 flex justify-center"]}
      />

      {/* Latest Posts Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-white sm:mb-4 sm:text-2xl">
          {t("latest_posts")}
        </h2>
        <p className="mb-4 text-base text-slate-300 sm:mb-6 sm:text-lg">
          {t("latest_posts_desc")}
        </p>
        <Suspense fallback={<LoadingGrid />}>
          <LatestPosts />
        </Suspense>

        <SuspenseAd
          placementName="genshinbuilds_incontent_2"
          classList={["mt-6 sm:mt-8 flex justify-center"]}
        />

        <div className="mt-3 text-right sm:mt-4">
          <Link
            href={`/${lang}/genshin/blog`}
            className="inline-flex items-center text-sm font-medium text-slate-300 transition-colors hover:text-white"
            prefetch={false}
          >
            {t("view_all_posts")}
            <svg
              className="ml-1 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Server Timers Section */}
      <section className="mt-8 sm:mt-12">
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-white sm:mb-4 sm:text-2xl">
          {t("server_timers")}
        </h2>
        <p className="mb-4 text-base text-slate-300 sm:mb-6 sm:text-lg">
          {t("server_timers_desc")}
        </p>
        <Suspense fallback={<LoadingCard />}>
          <ServerTimers />
        </Suspense>
      </section>

      <Suspense>
        <Ads className="mx-auto mt-8 sm:mt-12" adSlot={AD_ARTICLE_SLOT} />
      </Suspense>

      <SuspenseAd
        placementName="genshinbuilds_incontent_3"
        classList={["mt-8 sm:mt-12 flex justify-center"]}
      />

      {/* Farmable Today Section */}
      <section className="mt-8 sm:mt-12">
        <Suspense fallback={<LoadingGrid />}>
          <FarmableToday
            days={days}
            characters={charactersMap}
            weapons={weaponsMap}
            domains={domains}
          />
        </Suspense>
      </section>

      <SuspenseAd
        placementName="genshinbuilds_incontent_4"
        classList={["mt-8 sm:mt-12 flex justify-center mb-8 sm:mb-12"]}
      />
    </div>
  );
}
