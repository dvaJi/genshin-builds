import { i18n } from "i18n-config";
import { TeamData, Teams } from "interfaces/teams";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import GenshinTeamsList from "./list";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "teams");
  const title = t({
    id: "title",
    defaultMessage: "Best Team Comps | Genshin Impact Party Building Guide",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover the best team compositions for Genshin Impact with our comprehensive party building guide. Find optimal team comps for each character, explore different elemental synergies, and maximize your team's combat effectiveness.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/teams`,
    locale,
    openGraph: {
      title: title,
      description: description,
      url: `https://genshin-builds.com/${locale}/teams`,
      siteName: "Genshin Builds",
      images: [
        {
          url: "https://genshin-builds.com/images/og-image-teams.jpg",
          width: 1200,
          height: 630,
          alt: "Genshin Impact Best Team Compositions",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["https://genshin-builds.com/images/og-image-teams.jpg"],
    },
    alternates: {
      canonical: `https://genshin-builds.com/${locale}/teams`,
      languages: Object.fromEntries(
        i18n.locales.map((l) => [l, `https://genshin-builds.com/${l}/teams`]),
      ),
    },
  });
}

export default async function GenshinTeams({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "teams");

  const teams = await getGenshinData<Teams[]>({
    resource: "teams",
    language: langData,
  });

  const characters = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "element"],
    asMap: true,
  });

  // Process teams data
  const teamsByName: Record<string, TeamData[]> = teams.reduce(
    (map, { id, teams }) => {
      if (!characters[id]?.name || !teams[0]) return map;

      if (!map[characters[id].name]) {
        map[characters[id].name] = [];
      }

      map[characters[id].name].push({
        name: teams[0].name,
        characters: teams[0].characters.map((c) => ({
          id: c.id,
          name: characters[c.id]?.name || "",
          role: c.role,
          element: characters[c.id]?.element.name || "",
        })),
      } as any);

      return map;
    },
    {} as Record<string, TeamData[]>,
  );

  // Extract all unique elements from the teams data
  const allElements = new Set<string>();
  Object.values(teamsByName).forEach((teamArray) => {
    teamArray.forEach((team) => {
      team.characters.forEach((character) => {
        if (character.element) {
          allElements.add(character.element);
        }
      });
    });
  });

  const elements = Array.from(allElements);

  return (
    <div className="min-h-screen px-2 sm:px-0">
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:mb-8 sm:gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t({
              id: "best_team_comp",
              defaultMessage: "Best Team Compositions",
            })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
            {t({
              id: "teams_description",
              defaultMessage:
                "Discover the best team comps for Genshin Impact characters to maximize your team's combat effectiveness.",
            })}
          </p>
        </div>
        <Ads className="hidden md:block" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-4 sm:mb-8">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
      </div>

      <div className="card overflow-hidden">
        <GenshinTeamsList teamsByName={teamsByName} elements={elements} />
      </div>

      <div className="mt-4 sm:mt-8">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
