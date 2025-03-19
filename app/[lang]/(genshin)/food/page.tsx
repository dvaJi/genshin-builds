import { FoodItem } from "interfaces/genshin/food";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Food } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import GenshinMaterialsList from "./list";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.food",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/food`,
    locale: lang,
  });
}

export default async function GenshinFood({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.food");
  const langData = getLangData(lang, "genshin");

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
      <h2 className="my-6 text-2xl font-semibold text-gray-200">{t("food")}</h2>
      <GenshinMaterialsList food={food} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
