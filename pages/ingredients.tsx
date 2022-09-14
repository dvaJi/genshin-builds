import { GetStaticProps } from "next";
import GenshinData, { Ingredients } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import Card from "@components/ui/Card";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

type Props = {
  ingredients: Ingredients[];
};

const IngredientsPage = ({ ingredients }: Props) => {
  const { t } = useIntl("ingredients");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Cooking Ingredient List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Discover all the cooking ingredients.",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cooking_ingredient", defaultMessage: "Cooking Ingredient" })}
      </h2>
      <Card>
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
                  <LazyLoadImage
                    height={54}
                    width={54}
                    src={getUrl(`/ingredients/${row.id}.png`, 54, 54)}
                    alt={row.name}
                  />
                </td>
                <td>{row.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const ingredients = await genshinData.ingredients({ select: ["id", "name"] });

  return { props: { ingredients, lngDict } };
};

export default IngredientsPage;
