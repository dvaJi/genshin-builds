import { GetStaticProps } from "next";
import Link from "next/link";
import GenshinData, { Character } from "genshin-data";

import Card from "@components/ui/Card";
import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import CharacterPortrait from "@components/genshin/CharacterPortrait";
import ElementIcon from "@components/genshin/ElementIcon";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

type CharactersProps = {
  charactersByElement: Record<string, Character[]>;
  elements: string[];
  common: Record<string, string>;
};

const CharactersPage = ({
  charactersByElement,
  elements,
  common,
}: CharactersProps) => {
  const { t } = useIntl("characters");
  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Characters List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <div className="">
        {elements.map((element) => (
          <Card key={element}>
            <div className="mb-2 flex self-center">
              <ElementIcon type={common[element]} height={32} width={32} />
              <h3 className="ml-2 text-2xl font-bold text-white">
                {t({ id: element.toLowerCase(), defaultMessage: element })}
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center">
              {charactersByElement[element].map((character) => (
                <Link
                  key={character.id}
                  href={`/character/${character.id}`}
                  className="my-2 min-h-[120px]"
                >
                  <CharacterPortrait
                    character={character}
                    showElement={false}
                  />
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "element"],
  });
  const elements: string[] = [];
  const charactersByElement = characters
    // .filter((c) => !["thoma"].includes(c.id))
    .reduce<Record<string, Character[]>>((map, value) => {
      if (map[value.element]) {
        map[value.element].push(value);
      } else {
        elements.push(value.element);
        map[value.element] = [value];
      }

      return map;
    }, {});

  const common = require(`../_content/genshin/data/common.json`)[locale];

  return {
    props: {
      charactersByElement,
      elements,
      lngDict,
      common,
      bgStyle: {
        image: getUrl(`/regions/Inazuma_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default CharactersPage;
