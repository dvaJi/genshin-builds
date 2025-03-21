import { TeamData, Teams } from "interfaces/teams";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import GenshinTeamsList from "./list";

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
    namespace: "Genshin.teams",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/teams`,
    locale: lang,
  });
}

export default async function GenshinTeams({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.teams");
  const langData = getLangData(lang, "genshin");

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
            {t("best_team_comp")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
            {t("teams_description")}
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
