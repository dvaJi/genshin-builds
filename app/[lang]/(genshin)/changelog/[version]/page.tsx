import { Changelog } from "interfaces/genshin/changelog";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { redirect } from "@i18n/navigation";
import type {
  Artifact,
  Character,
  Food,
  TCGCard,
  Weapon,
} from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getAllMaterialsMap } from "@utils/materials";

import ChangelogVersion from "../view";

type Props = {
  params: Promise<{ lang: string; version: string }>;
};

export const runtime = "edge";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 43200;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, version } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.changelog",
  });
  const langData = getLangData(lang, "genshin");
  const currentVersion = await getGenshinData<Changelog>({
    resource: "changelog",
    language: langData,
    filter: {
      id: version,
    },
  });

  if (!currentVersion) return undefined;

  const title = t("title", { version: currentVersion.version });
  const description = t("description", { version: currentVersion.version });

  return genPageMetadata({
    title,
    description,
    path: `/changelog/${currentVersion.version}`,
    locale: lang,
  });
}

export default async function GenshinBannerWeapons({ params }: Props) {
  const { lang, version } = await params;
  setRequestLocale(lang);

  const langData = getLangData(lang, "genshin");
  const changelog = await getGenshinData<Changelog[]>({
    resource: "changelog",
    language: langData,
    select: ["version"],
  });

  const cl = await getGenshinData<Changelog>({
    resource: "changelog",
    language: langData,
    filter: {
      id: version,
    },
  });

  if (!cl) {
    return notFound();
  }

  if (cl.current) {
    return redirect({
      href: `/changelog`,
      locale: lang,
    });
  }

  const characters = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const weapons = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    language: langData,
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const food = await getGenshinData<Food[]>({
    resource: "food",
    language: langData,
    select: ["id", "name", "rarity", "results"],
  });
  const artifacts = await getGenshinData<Record<string, Artifact>>({
    resource: "artifacts",
    language: langData,
    select: ["id", "name", "max_rarity"],
    asMap: true,
  });
  const tcgCards = await getGenshinData<Record<string, TCGCard>>({
    resource: "tcgCards",
    language: langData,
    select: ["id", "name"],
    asMap: true,
  });

  const materialsMap = await getAllMaterialsMap(langData);

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const foodMap: any = {};
  const tcgMap: any = {};

  const item = cl.items;
  item.avatar?.forEach((a: string) => {
    charactersMap[a] = characters[a];
  });
  item.weapon?.forEach((w: string) => {
    weaponsMap[w] = weapons[w];
  });

  item.artifact?.forEach((a: string) => {
    artifactsMap[a] = artifacts[a];
  });
  item.food?.forEach((f: string) => {
    foodMap[f] = food.find((w) => w.id === f);
    const special = food.find((w) => {
      if (!w.results?.special) return false;
      return w.results?.special?.id === f;
    });
    if (special)
      foodMap[f] = {
        ...special.results.special,
        id: `${special.id}_special`,
        rarity: special.rarity,
      };
  });
  item.tcg?.forEach((t: string) => {
    tcgMap[t] = tcgCards[t];
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <ChangelogVersion
        changelog={cl}
        version={cl.version}
        versions={changelog.map((c) => c.version)}
        artifactsMap={artifactsMap}
        charactersMap={charactersMap}
        foodMap={foodMap}
        materialsMap={materialsMap}
        tcgMap={tcgMap}
        weaponsMap={weaponsMap}
        locale={lang}
      />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
