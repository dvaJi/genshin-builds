import { GetStaticProps } from "next";
import GenshinData, { Potion } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";
import Card from "@components/ui/Card";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

type Props = {
  potions: Potion[];
};

const PotionsPage = ({ potions }: Props) => {
  const { t } = useIntl("potions");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Potions List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Discover all the alchemy recipes and the best potions and oils to use for your team.",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "potions", defaultMessage: "Potions" })}
      </h2>
      <Card>
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
                  <LazyLoadImage
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
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const potions = await genshinData.potions({
    select: ["id", "name", "rarity", "effect"],
  });

  return { props: { potions, lngDict } };
};

export default PotionsPage;
