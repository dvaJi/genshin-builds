import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getAllMaterialsMap } from "@utils/materials";

import GenshinMaterialsList from "./list";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "materials");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Materials List",
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all the Materials",
  });

  return genPageMetadata({
    title,
    description,
    path: `/materials`,
    locale,
  });
}

export default async function GenshinIngredients({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "materials");

  const materialsMap = await getAllMaterialsMap(langData);
  const materials = Object.keys(materialsMap).map((key) => ({
    ...materialsMap[key],
    id: key,
  }));

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "materials", defaultMessage: "Materials" })}
      </h2>
      <GenshinMaterialsList materials={materials} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
