import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getData } from "@lib/localData";
import { getAllMaterialsMap } from "@utils/materials";
import { Changelog } from "interfaces/genshin/changelog";
import ChangelogVersion from "./view";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "banners_weapons"
  );
  const changelog = await getData<Changelog[]>("genshin", "changelog");
  const currentVersion = changelog[changelog.length - 1];

  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Changelog - {version}",
    values: { version: currentVersion.version },
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all the changes in the game in {version}",
    values: { version: currentVersion.version },
  });

  return genPageMetadata({
    title,
    description,
    path: `/changelog`,
    locale,
  });
}

export default async function GenshinBannerWeapons({ params }: Props) {
  const { langData } = await useTranslations(
    params.lang,
    "genshin",
    "banners_weapons"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const food = await genshinData.food({
    select: ["id", "name", "rarity", "results"],
  });
  const artifacts = await genshinData.artifacts({
    select: ["id", "name", "max_rarity"],
  });
  const tcgCards = await genshinData.tcgCards({
    select: ["id", "name"],
  });

  const changelog = await getData<Changelog[]>("genshin", "changelog");

  const materialsMap = await getAllMaterialsMap(genshinData);

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const foodMap: any = {};
  const tcgMap: any = {};

  const cl = changelog[changelog.length - 1];

  const item = cl.items;
  item.avatar?.forEach((a: string) => {
    charactersMap[a] = characters.find((c) => c.id === a);
  });
  item.weapon?.forEach((w: string) => {
    weaponsMap[w] = weapons.find((wp) => wp.id === w);
  });

  item.artifact?.forEach((a: string) => {
    artifactsMap[a] = artifacts.find((w) => w.id === a);
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
    tcgMap[t] = tcgCards.find((tc) => tc.id === t);
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
