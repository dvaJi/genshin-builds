import GenshinData, { Character, Weapon } from "genshin-data";
import { GetStaticProps } from "next";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import WeaponCalculator from "@components/WeaponCalculator";
import CharacterCalculator from "@components/CharacterCalculator";

import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";

type Props = {
  characters: Character[];
  weapons: Weapon[];
};

const Calculator = ({ characters, weapons }: Props) => {
  const { t } = useIntl();

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.calculator",
          defaultMessage: "Genshin Impact Calculator",
        })}
        pageDescription={t({
          id: "title.calculator.description",
          defaultMessage:
            "Genshin Impact Calculator to calculate how many mora and materials needed for your character or weapon ascension",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div>
        <h1 className="text-xl">Character Calculator</h1>
      </div>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <CharacterCalculator characters={characters} />
      </div>
      <div className="mt-6">
        <h1 className="text-xl">Weapon Calculator</h1>
      </div>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <WeaponCalculator weapons={weapons} />
      </div>
    </div>
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

  return {
    props: {
      lngDict,
      characters,
      weapons,
    },
  };
};

export default Calculator;
