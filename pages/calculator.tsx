import GenshinData, { Character, Weapon } from "genshin-data";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

import Metadata from "@components/Metadata";
import CharacterCalculator from "@components/genshin/CharacterCalculator";
import WeaponCalculator from "@components/genshin/WeaponCalculator";
import Card from "@components/ui/Card";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export const config = {
  runtime: "experimental-edge",
};

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
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div>
        <h1 className="text-xl text-white">Character Calculator</h1>
      </div>
      <Card>
        <CharacterCalculator characters={characters} />
      </Card>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <div className="mt-6">
        <h1 className="text-xl text-white">Weapon Calculator</h1>
      </div>
      <Card>
        <WeaponCalculator weapons={weapons} />
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = "en",
}) => {
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
        image: getUrlLQ(`/regions/Inazuma_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default Calculator;
