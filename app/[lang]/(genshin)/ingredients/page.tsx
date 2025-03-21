import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Ingredients } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";

export const dynamic = "force-static";
export const runtime = "edge";

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
    namespace: "Genshin.ingredients",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/ingredients`,
    locale: lang,
  });
}

export default async function GenshinIngredients({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.ingredients");
  const langData = getLangData(lang, "genshin");

  const ingredients = await getGenshinData<Ingredients[]>({
    resource: "ingredients",
    language: langData,
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
        {t("cooking_ingredient")}
      </h2>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <th></th>
              <th>{t("name")}</th>
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
