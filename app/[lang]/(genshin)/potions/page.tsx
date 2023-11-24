import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import StarRarity from "@components/StarRarity";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

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
    "potions"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Potions List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Discover all the alchemy recipes and the best potions and oils to use for your team.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/potions`,
    locale,
  });
}

export default async function GenshinIngredients({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "potions"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const potions = await genshinData.potions({
    select: ["id", "name", "rarity", "effect"],
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
              <th>{t({ id: "rarity", defaultMessage: "Rarity" })}</th>
              <th>{t({ id: "effect", defaultMessage: "Effect" })}</th>
            </tr>
          </thead>
          <tbody>
            {potions.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"}
              >
                <td>
                  <img
                    height={54}
                    width={54}
                    src={getUrl(`/potions/${row.id}.png`, 54, 54)}
                    alt={row.name}
                  />
                </td>
                <td>{row.name}</td>
                <td>
                  <StarRarity rarity={row.rarity} />
                </td>
                <td>{row.effect}</td>
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
