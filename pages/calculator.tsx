import GenshinData, { Character, Weapon } from "genshin-data";
import { GetStaticProps } from "next";

import Card from "@components/ui/Card";
import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import WeaponCalculator from "@components/genshin/WeaponCalculator";
import CharacterCalculator from "@components/genshin/CharacterCalculator";

import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

type Props = {
  characters: Character[];
  weapons: Weapon[];
};

const Calculator = ({ characters, weapons }: Props) => {
  const { t } = useIntl("calculator");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Calculator",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Genshin Impact Calculator to calculate how many mora and materials needed for your character or weapon ascension",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div>
        <h1 className="text-xl text-white">Character Calculator</h1>
      </div>
      <Card>
        <CharacterCalculator characters={characters} />
      </Card>
      <div className="mt-6">
        <h1 className="text-xl text-white">Weapon Calculator</h1>
      </div>
      <Card>
        <WeaponCalculator weapons={weapons} />
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = (
    await genshinData.weapons({
      select: ["id", "name", "rarity"],
    })
  ).filter((w) => w.rarity > 2);

  return {
    props: {
      lngDict,
      characters,
      weapons,
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

export default Calculator;
