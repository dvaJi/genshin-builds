import { GetStaticProps } from "next";
import Link from "next/link";
import GenshinData, { Character } from "genshin-data";

import Metadata from "@components/Metadata";
import CharacterPortrait from "@components/CharacterPortrait";
import ElementIcon from "@components/ElementIcon";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";

type CharactersProps = {
  charactersByElement: Record<string, Character[]>;
  elements: string[];
  lngDict: Record<string, string>;
  common: Record<string, string>;
};

const CharactersPage = ({
  charactersByElement,
  elements,
  lngDict,
  common,
}: CharactersProps) => {
  const [f, fn] = useIntl(lngDict);
  return (
    <div>
      <Metadata
        fn={fn}
        pageTitle={fn({
          id: "title.characters",
          defaultMessage: "Genshin Impact Characters List",
        })}
        pageDescription={fn({
          id: "title.characters.description",
          defaultMessage:
            "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <div className="">
        {elements.map((element) => (
          <div
            key={element}
            className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800"
          >
            <div className="flex self-center mb-2">
              <ElementIcon type={common[element]} height={32} width={32} />
              <h3 className="text-2xl font-bold ml-2">
                {f({ id: element, defaultMessage: element })}
              </h3>
            </div>

            <div className="flex justify-center items-center flex-wrap">
              {charactersByElement[element].map((character) => (
                <Link key={character.id} href={`/character/${character.id}`}>
                  <a>
                    <CharacterPortrait
                      character={{ ...character, element: common[element] }}
                    />
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

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const elements: string[] = [];
  const charactersByElement = characters
    .filter((c) => c.id !== "eula")
    .reduce<Record<string, Character[]>>((map, value) => {
      if (map[value.element]) {
        map[value.element].push(value);
      } else {
        elements.push(value.element);
        map[value.element] = [value];
      }

      return map;
    }, {});

  const common = require(`../_content/data/common.json`)[locale];

  return {
    props: { charactersByElement, elements, lngDict, common },
    revalidate: 1,
  };
};

export default CharactersPage;
