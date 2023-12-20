import type { Food } from "genshin-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import GenshinMaterialsList from "./list";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { i18n } from "i18n-config";
import { FoodItem } from "interfaces/genshin/food";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "genshin", "food");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Cooking Recipes List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover all the cooking recipes and the best food to cook for your team.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/food`,
    locale,
  });
}

export default async function GenshinFood({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "genshin", "food");

  const dishesList = await getGenshinData<Food[]>({
    resource: "food",
    language: langData,
    select: ["id", "name", "rarity", "results"],
  });

  const food: FoodItem[] = [];

  dishesList.forEach((item) => {
    food.push({
      id: item.id,
      name: item.results.normal.name,
      rarity: item.rarity,
      effect: item.results.normal.effect,
      type: "normal",
    });
    // food.push({
    //   id: item.id,
    //   name: item.results.delicious.name,
    //   rarity: item.rarity,
    //   effect: item.results.delicious.effect,
    //   type: "delicious",
    // });
    // food.push({
    //   id: item.id,
    //   name: item.results.suspicious.name,
    //   rarity: item.rarity,
    //   effect: item.results.suspicious.effect,
    //   type: "suspicious",
    // });

    if (item.results.special) {
      food.push({
        id: item.id,
        name: item.results.special.name,
        rarity: item.rarity,
        effect: item.results.special.effect,
        type: "special",
        character: item.results.special.character,
      });
    }
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "food", defaultMessage: "Food" })}
      </h2>
      <GenshinMaterialsList food={food} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
