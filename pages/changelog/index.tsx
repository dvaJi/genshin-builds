import GenshinData, { TCGCard } from "genshin-data";
import { GetStaticProps } from "next";

import { getUrlLQ } from "@lib/imgUrl";
import { getCommon, getData, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";
import ChangelogVersion from "./[version]";
import { Changelog } from "interfaces/genshin/changelog";

type Props = {
  changelog: any;
  version: string;
  versions: string[];
  charactersMap: any;
  artifactsMap: any;
  weaponsMap: any;
  materialsMap: any;
  foodMap: any;
  tcgMap: Record<string, TCGCard>;
};

function Changelog(props: Props) {
  return <ChangelogVersion {...props} />;
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
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
  const common = await getCommon(locale, "genshin");
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

  return {
    props: {
      changelog: cl,
      version: cl.version,
      versions: changelog.map(c => c.version),
      charactersMap,
      weaponsMap,
      artifactsMap,
      materialsMap,
      foodMap,
      lngDict,
      common,
      bgStyle: {
        image: getUrlLQ(`/regions/Sumeru_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default Changelog;
