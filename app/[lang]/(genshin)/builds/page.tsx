import type { Build } from "interfaces/build";
import type { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";
import { getBonusSet } from "@utils/bonus_sets";

import ElementsFilter from "./elements-filter";
import List from "./list";
import Search from "./search";

interface Props {
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "builds");

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
  const { lang } = await params;
  const { t, langData, locale, common, dict } = await getTranslations(
    lang,
    "genshin",
    "builds",
  );
  const [beta, _characters, buildsOld, weaponsList, artifactsList] =
    await Promise.all([
      getData<Beta>("genshin", "beta"),
      getGenshinData<Character[]>({
        resource: "characters",
        language: langData as any,
        select: ["id", "name", "rarity", "element"],
        revalidate: 0,
      }),
      getGenshinData<Record<string, Build>>({
        resource: "builds",
        language: langData as any,
        asMap: true,
        revalidate: 0,
      }),
      getGenshinData<Record<string, Weapon>>({
        resource: "weapons",
        language: langData as any,
        select: ["id", "name", "rarity", "stats"],
        asMap: true,
        revalidate: 0,
      }),
      getGenshinData<Record<string, Artifact>>({
        resource: "artifacts",
        language: langData as any,
        select: ["id", "name", "max_rarity", "two_pc", "four_pc"],
        asMap: true,
        revalidate: 0,
      }),
    ]);

  const bonusSets = getBonusSet(artifactsList, dict, common);

  // Ensure beta characters are valid and have required properties
  const betaCharacters = (beta[locale]?.characters ?? []).filter(
    (char) =>
      char &&
      typeof char === "object" &&
      char.id &&
      char.element &&
      typeof char.element === "object" &&
      char.element.name,
  );

  // Filter out any invalid characters from the main list
  const validCharacters = _characters.filter(
    (char) =>
      char &&
      typeof char === "object" &&
      char.id &&
      char.element &&
      typeof char.element === "object" &&
      char.element.name,
  );

  const characters = [...betaCharacters, ...validCharacters];

  const allBuilds = [];
  for (const character of characters) {
    // Skip if character is not valid
    if (!character?.id) continue;

    const builds = buildsOld[character.id];
    // Skip if no builds data exists for this character
    if (!builds?.builds?.length) {
      continue;
    }

    const build =
      builds.builds.filter((b) => b.recommended)[0] ?? builds.builds[0];
    // Skip if no valid build
    if (!build) continue;

    const weapons = (build.weapons || [])
      .map((weapon) => {
        if (!weapon?.id) return undefined;
        const weaponData = weaponsList[weapon.id];
        if (!weaponData) {
          return undefined;
        }
        return {
          ...weaponData,
          r: weapon.r,
        };
      })
      .filter(Boolean);

    const artifacts = (build.sets || []).map((set) => {
      return set
        .map((artifact) => {
          if (!artifact) return undefined;
          if (bonusSets[artifact]) {
            return bonusSets[artifact];
          }
          return artifactsList[artifact];
        })
        .filter(Boolean);
    });

    allBuilds.push({
      character,
      role: build.role,
      element: character.element?.name ? t(character.element.name) : "",
      weapons,
      artifacts,
      stats_priority: (build.stats_priority || []).map((s) =>
        common[s] ? common[s] : s,
      ),
      note: build.build_notes,
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
    });
  }

  const elements: { label: string; value: string }[] = [];

  for (const character of characters) {
    if (!elements.find((e) => e.value === character.element.name)) {
      elements.push({
        label: t(character.element.name),
        value: character.element.name,
      });
    }
  }

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
