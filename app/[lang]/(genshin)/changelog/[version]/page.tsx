import type {
  Artifact,
  Character,
  Food,
  TCGCard,
  Weapon,
} from "@interfaces/genshin";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import ChangelogVersion from "../view";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getRemoteData } from "@lib/localData";
import { getAllMaterialsMap } from "@utils/materials";
import { i18n } from "i18n-config";
import { Changelog } from "interfaces/genshin/changelog";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string; version: string };
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const langs = i18n.locales;
  const changelogs = await getRemoteData<Changelog[]>("genshin", "changelog");

  return langs
    .map((lang) => changelogs.map((c) => ({ lang, version: c.version })))
    .flat(Infinity);
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "changelog"
  );
  const changelog = await getRemoteData<Changelog[]>("genshin", "changelog");
  const currentVersion = changelog.find((c) => c.version === params.version);

  if (!currentVersion) return undefined;

  const title = t({
    id: "title",
    defaultMessage:
      "Genshin Impact {version} Update: Latest Features, Changes, and Improvements",
    values: { version: currentVersion.version },
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover all the new adventures in Genshin Impact {version}! Our comprehensive guide covers the latest features, character updates, and gameplay enhancements. Stay ahead in Teyvat with the newest version's detailed changelog.",
    values: { version: currentVersion.version },
  });

  return genPageMetadata({
    title,
    description,
    path: `/changelog/${currentVersion.version}`,
    locale,
  });
}

export default async function GenshinBannerWeapons({ params }: Props) {
  const { langData } = await useTranslations(
    params.lang,
    "genshin",
    "changelog"
  );
  const changelog = await getRemoteData<Changelog[]>("genshin", "changelog");

  const cl = changelog.find((c) => c.version === params.version);

  if (!cl) {
    return notFound();
  }
  if (cl.current) {
    return redirect(`/${params.lang}/changelog`);
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
        locale={params.lang}
      />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
