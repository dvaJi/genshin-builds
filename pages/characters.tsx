import { GetStaticProps } from "next";
import Link from "next/link";
import GenshinData, { Character } from "genshin-data";

import CharacterPortrait from "@components/CharacterPortrait";
import ElementIcon from "@components/ElementIcon";

import useIntl from "@hooks/use-intl";

import { localeToLang } from "@utils/locale-to-lang";

type CharactersProps = {
  charactersByElement: Record<string, Character[]>;
  elements: string[];
  lngDict: Record<string, string>;
};

const CharactersPage = ({
  charactersByElement,
  elements,
  lngDict,
}: CharactersProps) => {
  const [f] = useIntl(lngDict);
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <div className="">
        {elements.map((element) => (
          <div
            key={element}
            className="mb-3 p-5 rounded border border-gray-900 bg-gray-800"
          >
            <div className="flex self-center mb-2">
              <ElementIcon type={element} height={32} width={32} />
              <h3 className="text-2xl font-bold ml-2">{element}</h3>
            </div>

            <div className="flex justify-center items-center flex-wrap">
              {charactersByElement[element].map((character) => (
                <Link href={`/character/${character.id}`}>
                  <a>
                    <CharacterPortrait character={character} />
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters();
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

export default CharactersPage;
