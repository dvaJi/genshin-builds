import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import GenshinMaterialsList from "./list";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getAllMaterialsMap } from "@utils/materials";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

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
    "materials"
  );
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
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "materials"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const materialsMap = await getAllMaterialsMap(genshinData);
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
