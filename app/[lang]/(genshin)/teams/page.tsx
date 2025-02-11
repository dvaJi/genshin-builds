import { i18n } from "i18n-config";
import { TeamData, Teams } from "interfaces/teams";
import type { Metadata } from "next";
import { Fragment } from "react";

import { genPageMetadata } from "@app/seo";
import TeamCard from "@components/genshin/TeamCard";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

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
    defaultMessage: "Best Team Comp | Party Building Guide",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "This is a guide to making the best party in Genshin Impact. Learn how to make the best party! We introduce the best party composition for each task including exploring areas, slaying field bosses, and more!",
  });

  return genPageMetadata({
    title,
    description,
    path: `/teams`,
    locale,
  });
}

export default async function GenshinCharacters({ params }: Props) {
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
    {} as Record<string, TeamData[]>
  );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(teamsByName).map(([mainName, teams], i) => (
          <Fragment key={mainName}>
            {teams.map((team) => (
              <TeamCard
                key={team.name}
                team={team}
                mainName={mainName}
                asyncLoad={i > 4}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
