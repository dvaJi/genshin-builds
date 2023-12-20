import type { Character } from "@interfaces/genshin";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { Fragment } from "react";

import { genPageMetadata } from "@app/seo";
import TeamCard from "@components/genshin/TeamCard";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { i18n } from "i18n-config";
import { TeamData, Teams } from "interfaces/teams";

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
  const { t, locale } = await useTranslations(params.lang, "genshin", "teams");
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
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "teams"
  );

  const teams = require(
    `../../../../_content/genshin/data/teams.json`
  ) as Teams;

  const characters = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "element"],
    asMap: true,
  });

  const teamsByName: Record<string, TeamData[]> = Object.entries(teams).reduce(
    (map, [id, characterTeams]) => {
      if (!characters[id]?.name || !characterTeams[0]) return map;

      if (!map[characters[id].name]) {
        map[characters[id].name] = [];
      }

      map[characters[id].name].push({
        name: characterTeams[0].name,
        characters: characterTeams[0].characters.map((c) => ({
          id: c.id,
          name: characters[c.id]?.name || "",
          role: c.role,
          element: characters[c.id]?.element || "",
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
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(teamsByName).map(([mainName, teams]) => (
          <Fragment key={mainName}>
            {teams.map((team) => (
              <TeamCard key={team.name} team={team} mainName={mainName} />
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
