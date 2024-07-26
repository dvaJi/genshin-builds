import type { Build } from "interfaces/build";
import type { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import FrstAds from "@components/ui/FrstAds";
import useTranslations from "@hooks/use-translations";
import { i18n } from "@i18n-config";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData, getRemoteData } from "@lib/localData";
import { getBonusSet } from "@utils/bonus_sets";

import ElementsFilter from "./elements-filter";
import List from "./list";
import Search from "./search";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });

interface Props {
  params: {
    lang: string;
  };
}

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string }[] = [];

  for await (const lang of i18n.locales) {
    routes.push({
      lang,
    });
  }

  return routes;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "genshin", "builds");

  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/builds`,
    locale,
  });
}

export default async function GenshinCharacterPage({ params }: Props) {
  const { t, langData, locale, common, dict } = await useTranslations(
    params.lang,
    "genshin",
    "builds"
  );
  const beta = await getData<Beta>("genshin", "beta");
  const _characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData as any,
    select: ["id", "name", "rarity", "element"],
  });

  const characters = [...(beta[locale]?.characters ?? []), ..._characters];

  const buildsOld = await getRemoteData<Record<string, Build[]>>(
    "genshin",
    "builds"
  );
  const weaponsList = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    language: langData as any,
    select: ["id", "name", "rarity", "stats"],
    asMap: true,
  });

  const artifactsList = await getGenshinData<Record<string, Artifact>>({
    resource: "artifacts",
    language: langData as any,
    select: ["id", "name", "max_rarity", "two_pc", "four_pc"],
    asMap: true,
  });
  const bonusSets = getBonusSet(artifactsList, dict, common);

  const allBuilds = characters
    .map((character) => {
      const builds = buildsOld[character.id];
      // const mostUsed = builds?.find((build) => build.most_used) as MostUsedBuild;
      if (!builds) {
        return null;
      }

      const build = builds.filter((build) => build.recommended)[0] ?? builds[0];
      const weapons = build.weapons
        .map((weapon) => ({
          ...weaponsList[weapon.id],
          r: weapon.r,
        }))
        .filter((weapon) => weapon);
      const artifacts = build.sets
        .map((set) => {
          return set.map((artifact) => {
            if (bonusSets[artifact]) {
              return bonusSets[artifact];
            }

            return artifactsList[artifact];
          });
        })
        .filter((artifact) => artifact);

      return {
        character,
        role: build.role,
        element: t(character.element),
        weapons,
        artifacts,
        stats_priority: build.stats_priority.map((s) =>
          common[s] ? common[s] : s
        ),
        stats: {
          circlet:
            build.stats?.circlet?.map((s) => (common[s] ? common[s] : s)) || [],
          flower:
            build.stats?.flower?.map((s) => (common[s] ? common[s] : s)) || [],
          goblet:
            build.stats?.goblet?.map((s) => (common[s] ? common[s] : s)) || [],
          plume:
            build.stats?.plume?.map((s) => (common[s] ? common[s] : s)) || [],
          sands:
            build.stats?.sands?.map((s) => (common[s] ? common[s] : s)) || [],
        },
      };
    })
    .filter((build) => build !== null);

  const elements = characters.reduce(
    (acc, character) => {
      const element = {
        label: t(character.element),
        value: character.element,
      };

      if (!acc.find((el) => el.value === element.value)) {
        acc.push(element);
      }

      return acc;
    },
    [] as { label: string; value: string }[]
  );

  return (
    <main className="relative mx-auto max-w-screen-lg">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <h1 className="text-3xl text-white">{t("title")}</h1>
        <Search
          messages={{
            searchPlaceholder: t("search_placeholder"),
            clearSearch: t("clear_search"),
          }}
        />
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mb-5 w-full px-2 lg:px-0">
        <ElementsFilter elements={elements} />
      </div>
      <List
        builds={allBuilds}
        locale={locale}
        messages={{
          show_build_details: t("show_build_details"),
          hide_build_details: t("hide_build_details"),
          sands: t("sands"),
          goblet: t("goblet"),
          circlet: t("circlet"),
          main_stats: t("main_stats"),
          substats: t("substats"),
          best_weapons: t("best_weapons"),
          best_artifacts: t("best_artifacts"),
        }}
      />
    </main>
  );
}
