import GenshinData from "genshin-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import CharacterCalculator from "@components/genshin/CharacterCalculator";
import WeaponCalculator from "@components/genshin/WeaponCalculator";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { i18n } from "i18n-config";
import { ResinCalculatorForm } from "./resin-calculator-form";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({
    lang,
  }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "calculator"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Calculator",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Genshin Impact Calculator to calculate how many mora and materials needed for your character or weapon ascension",
  });

  return genPageMetadata({
    title,
    description,
    path: `/calculator`,
    locale,
  });
}

export default async function GenshinCalculator({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "calculator"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const characters = await genshinData.characters({
    select: ["_id", "id", "name"],
  });
  const weapons = (
    await genshinData.weapons({
      select: ["id", "name", "rarity"],
    })
  ).filter((w) => w.rarity > 2);

  return (
    <div className="w-full">
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({
          id: "calculator",
          defaultMessage: "Leaderboard - Top Builds from the Community",
        })}
      </h2>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div>
        <h1 className="text-xl text-white">Character Calculator</h1>
      </div>
      <div className="card">
        <CharacterCalculator characters={characters} />
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <div className="mt-6">
        <h1 className="text-xl text-white">Weapon Calculator</h1>
      </div>
      <div className="card">
        <WeaponCalculator weapons={weapons} />
      </div>
      <div className="mt-6">
        <h1 className="text-xl text-white">Resin Calculator</h1>
      </div>
        <ResinCalculatorForm />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
