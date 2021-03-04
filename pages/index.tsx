import { GetStaticProps } from "next";
import GenshinData, { Character } from "genshin-data";

import CharactersPage from "./characters";
import { localeToLang } from "@utils/locale-to-lang";

type CharactersProps = {
  charactersByElement: Record<string, Character[]>;
  elements: string[];
  lngDict: Record<string, string>;
};

const IndexPage = ({
  charactersByElement,
  elements,
  lngDict,
}: CharactersProps) => {
  return (
    <CharactersPage
      charactersByElement={charactersByElement}
      elements={elements}
      lngDict={lngDict}
    />
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const elements: string[] = [];
  const charactersByElement = characters.reduce<Record<string, Character[]>>(
    (map, value) => {
      if (map[value.element]) {
        map[value.element].push(value);
      } else {
        elements.push(value.element);
        map[value.element] = [value];
      }

      return map;
    },
    {}
  );

  return {
    props: { charactersByElement, elements, lngDict },
    revalidate: 1,
  };
};

export default IndexPage;
