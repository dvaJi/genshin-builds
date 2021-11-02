/* eslint-disable react/jsx-key */
import clsx from "clsx";
import { GetStaticProps } from "next";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import SimpleRarityBox from "@components/SimpleRarityBox";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { useLocalStorage } from "@hooks/use-local-storage";
import { getUrl } from "@lib/imgUrl";
import CharacterCalculator from "@components/CharacterCalculator";
import GenshinData, { Character, Weapon } from "genshin-data";
import { localeToLang } from "@utils/locale-to-lang";
import { CharacterLvlExp } from "interfaces/characterlvlexp";
import WeaponCalculator from "@components/WeaponCalculator";

type Props = {
  characters: Character[];
  weapons: Weapon[];
  lvlExp: number[];
  wlvlExp: number[][];
};

const Calculator = ({ characters, weapons, lvlExp, wlvlExp }: Props) => {
  const { t } = useIntl();

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.codes",
          defaultMessage: "Genshin Impact Codes – free primogems and mora",
        })}
        pageDescription={t({
          id: "title.codes.description",
          defaultMessage:
            "We round up the latest Genshin Impact codes, so you can get freebies",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "codes", defaultMessage: "Codes" })}
      </h2>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <CharacterCalculator characters={characters} lvlExp={lvlExp} />
      </div>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <WeaponCalculator weapons={weapons} lvlExp={wlvlExp} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "talent_materials", "ascension"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity", "ascensions"],
  });

  const lvlExp = require("../_content/data/character_lvl_exp.json");
  const wlvlExp = require("../_content/data/weapon_lvl_exp.json");

  return { props: { lngDict, characters, weapons, lvlExp, wlvlExp } };
};

export default Calculator;
