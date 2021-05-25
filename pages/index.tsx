import { GetStaticProps } from "next";
import GenshinData, { Character, Weapon } from "genshin-data";

import planning from "../_content/data/talents.json";

import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import AscensionPlanner from "./ascension-planner";

type Props = {
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
  lngDict: Record<string, string>;
  planMap: Record<string, any>;
};

const IndexPage = ({ characters, weapons, planMap }: Props) => {
  return (
    <AscensionPlanner
      characters={characters}
      weapons={weapons}
      planMap={planMap}
    />
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const charactersMap = characters.reduce<Record<string, Character>>(
    (map, value) => {
      map[value.id] = value;
      return map;
    },
    {}
  );

  const weaponsMap = weapons.reduce<Record<string, Weapon>>((map, value) => {
    map[value.id] = value;
    return map;
  }, {});

  return {
    props: {
      characters: charactersMap,
      weapons: weaponsMap,
      lngDict,
      planMap: planning,
    },
    revalidate: 1,
  };
};

export default IndexPage;
