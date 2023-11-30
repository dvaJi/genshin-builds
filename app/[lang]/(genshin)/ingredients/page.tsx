import GenshinData from "genshin-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { i18n } from "i18n-config";

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
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "ingredients"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Cooking Ingredient List",
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all the cooking ingredients.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/ingredients`,
    locale,
  });
}

export default async function GenshinIngredients({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "ingredients"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const ingredients = await genshinData.ingredients({
    select: ["id", "name"],
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cooking_ingredient", defaultMessage: "Cooking Ingredient" })}
      </h2>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              <th>{t({ id: "name", defaultMessage: "Name" })}</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"}
              >
                <td>
                  <img
                    height={54}
                    width={54}
                    src={getUrl(`/materials/${row.id}.png`, 54, 54)}
                    alt={row.name}
                  />
                </td>
                <td>{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
