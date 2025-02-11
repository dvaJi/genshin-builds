import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { genPageMetadata } from "@app/seo";
import ServerTimers from "@components/ServerTimers";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character, Domains, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import { Banners } from "./banners";
import FarmableToday from "./farmable-today";
import { LatestPosts } from "./latest-posts";
import Shortcuts from "./shortcuts";

// Loading components with improved visual design
const LoadingCard = () => (
  <div className="bg-card/90 relative h-64 w-full animate-pulse overflow-hidden rounded-xl p-6">
    <div className="bg-muted/50 h-32 w-full rounded-lg" />
    <div className="bg-muted/50 mt-4 h-4 w-2/3 rounded" />
    <div className="bg-muted/50 mt-2 h-4 w-1/3 rounded" />
  </div>
);

const LoadingGrid = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="bg-card/50 h-24 w-full animate-pulse rounded-lg backdrop-blur-sm" />
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
  const { t, locale } = await getTranslations(
    lang,
    "genshin",
    "ascension_planner"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Builds | Genshin Impact Wiki Database",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Learn about every character in Genshin Impact including their skills, talents, builds, and tier list.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/`,
    locale,
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
  const { t, langData } = await getTranslations(
    lang,
    "genshin",
    "ascension_planner"
  );

  const { domains, charactersMap, weaponsMap } = await getData(langData);
  const days = domains.characters[0].rotation.map((r) => r.day);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Welcome Card */}
      <div className="bg-card/95 relative overflow-hidden rounded-2xl p-8 shadow-xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(255,255,255,0.08)_0%,_transparent_50%)]" />
        <div className="relative">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {t({
              id: "welcome_title",
              defaultMessage: "Welcome to Genshin-Builds! ✨",
            })}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed">
            {t({
              id: "welcome_desc",
              defaultMessage:
                "Discover character builds, comprehensive guides, and a wiki database all in one place. Genshin-Builds is here to assist you in planning your farming activities with an ascension calculator. Keep track of your progress effortlessly with a convenient todo list. Level up your Genshin Impact experience with this invaluable resource!",
            })}
          </p>
        </div>
      </div>

      <SuspenseAd
        placementName="genshinbuilds_billboard_atf"
        classList={["mt-8 flex justify-center"]}
      />

      {/* Shortcuts Section */}
      <section className="mt-12">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {t({ id: "shortcuts", defaultMessage: "Shortcuts" })}
        </h2>
        <Shortcuts lang={lang} />
      </section>

      {/* Banners Section */}
      <section className="mt-12">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {t({ id: "banners", defaultMessage: "Banners" })}
        </h2>
        <p className="mb-6 text-lg text-slate-300">
          {t({
            id: "banners_desc",
            defaultMessage:
              "Check out the latest banners and their duration in Genshin Impact.",
          })}
        </p>
        <Suspense fallback={<LoadingGrid />}>
          <Banners lang={lang} />
        </Suspense>
      </section>

      <SuspenseAd
        placementName="genshinbuilds_incontent_1"
        classList={["mt-12 flex justify-center"]}
      />

      {/* Latest Posts Section */}
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">
          {t({ id: "latest_posts", defaultMessage: "Latest Posts" })}
        </h2>
        <p className="mb-6 text-lg text-slate-300">
          {t({
            id: "latest_posts_desc",
            defaultMessage:
              "Stay up to date with the latest news, guides, and updates in Genshin Impact.",
          })}
        </p>
        <Suspense fallback={<LoadingGrid />}>
          <LatestPosts />
        </Suspense>

        <SuspenseAd
          placementName="genshinbuilds_incontent_2"
          classList={["mt-8 flex justify-center"]}
        />

        <div className="mt-4 text-right">
          <Link
            href={`/${lang}/genshin/blog`}
            className="inline-flex items-center text-sm font-medium text-slate-300 transition-colors hover:text-white"
            prefetch={false}
          >
            {t({ id: "view_all_posts", defaultMessage: "View all posts" })}
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
      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">
          {t({ id: "server_timers", defaultMessage: "Server Timers" })}
        </h2>
        <p className="mb-6 text-lg text-slate-300">
          {t({
            id: "server_timers_desc",
            defaultMessage:
              "The daily reset occurs at 04:00 (4 AM), based on your server's time zone. The weekly reset occurs each Monday, also at 04:00 (4 AM).",
          })}
        </p>
        <Suspense fallback={<LoadingCard />}>
          <ServerTimers />
        </Suspense>
      </section>

      <Suspense>
        <Ads className="mx-auto mt-12" adSlot={AD_ARTICLE_SLOT} />
      </Suspense>

      <SuspenseAd
        placementName="genshinbuilds_incontent_3"
        classList={["mt-12 flex justify-center"]}
      />

      {/* Farmable Today Section */}
      <section className="mt-12">
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
        classList={["mt-12 flex justify-center mb-12"]}
      />
    </div>
  );
}
