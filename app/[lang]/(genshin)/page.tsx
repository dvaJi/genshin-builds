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

export default async function IndexPage({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "genshin",
    "ascension_planner"
  );

  const domains = await getGenshinData<Domains>({
    resource: "domains",
    language: langData,
  });

  const charactersMap = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const weaponsMap = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const days = domains.characters[0].rotation.map((r) => r.day);

  return (
    <div className="mx-2 md:mx-0">
      <div className="card">
        <h1 className="text-lg text-slate-100">
          {t({
            id: "welcome_title",
            defaultMessage: "Welcome to Genshin-Builds! ✨",
          })}
        </h1>
        <p>
          {t({
            id: "welcome_desc",
            defaultMessage:
              "Discover character builds, comprehensive guides, and a wiki database all in one place. Genshin-Builds is here to assist you in planning your farming activities with an ascension calculator. Keep track of your progress effortlessly with a convenient todo list. Level up your Genshin Impact experience with this invaluable resource!",
          })}
        </p>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <br />
      <h2 className="text-2xl font-semibold text-gray-200">
        {t({
          id: "shortcuts",
          defaultMessage: "Shortcuts",
        })}
      </h2>
      <Shortcuts lang={lang} />
      <div className="mt-4">
        <div className="m-2">
          <h2 className="text-2xl font-semibold text-gray-200">
            {t({
              id: "banners",
              defaultMessage: "Banners",
            })}
          </h2>
          <p>
            {t({
              id: "banners_desc",
              defaultMessage:
                "Check out the latest banners and their duration in Genshin Impact.",
            })}
          </p>
          <Suspense
            fallback={
              <div className="grid h-full w-full gap-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-4">
                <div className="h-70 w-full animate-pulse rounded bg-vulcan-700" />
                <div className="h-70 w-full animate-pulse rounded bg-vulcan-700" />
                <div className="h-70 w-full animate-pulse rounded bg-vulcan-700" />
              </div>
            }
          >
            <Banners lang={lang} />
          </Suspense>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="m-2">
          <h2 className="text-2xl font-semibold text-gray-200">
            {t({
              id: "latest_posts",
              defaultMessage: "Latest Posts",
            })}
          </h2>
          <p>
            {t({
              id: "latest_posts_desc",
              defaultMessage:
                "Stay up to date with the latest news, guides, and updates in Genshin Impact.",
            })}
          </p>
          <Suspense
            fallback={
              <div className="grid h-full w-full gap-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-4">
                <div className="h-60 w-full animate-pulse rounded bg-vulcan-700" />
                <div className="h-60 w-full animate-pulse rounded bg-vulcan-700" />
                <div className="h-60 w-full animate-pulse rounded bg-vulcan-700" />
              </div>
            }
          >
            <LatestPosts />
          </Suspense>
          <FrstAds
            placementName="genshinbuilds_incontent_2"
            classList={["flex", "justify-center"]}
          />
          <div className="mx-2 text-right text-sm hover:text-white">
            <Link href={`/${lang}/genshin/blog`} prefetch={false}>
              {t({
                id: "view_all_posts",
                defaultMessage: "View all posts",
              })}
            </Link>
          </div>
        </div>
        <div className="m-2">
          <h2 className="text-2xl font-semibold text-gray-200">
            {t({
              id: "server_timers",
              defaultMessage: "Server Timers",
            })}
          </h2>
          <p>
            {t({
              id: "server_timers_desc",
              defaultMessage:
                "The daily reset occurs at 04:00 (4 AM), based on your server's time zone. The weekly reset occurs each Monday, also at 04:00 (4 AM).",
            })}
          </p>
          <ServerTimers />
        </div>
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
        <FarmableToday
          days={days}
          characters={charactersMap}
          weapons={weaponsMap}
          domains={domains}
        />
        <FrstAds
          placementName="genshinbuilds_incontent_4"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
