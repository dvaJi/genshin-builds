/* eslint-disable react/jsx-key, react-hooks/exhaustive-deps */
import clsx from "clsx";
import GenshinData from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Metadata from "@components/Metadata";
import SearchInput from "@components/SearchInput";
import FoodCard from "@components/genshin/FoodCard";

import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export type FoodItem = {
  id: string;
  name: string;
  rarity: number;
  type: string;
  effect: string;
  character?: {
    id: string;
    name: string;
  };
};

type Props = {
  food: FoodItem[];
};

const FoodPage = ({ food }: Props) => {
  const [filteredFood, setFoodFilter] = useState(food);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { t } = useIntl("food");

  const filterWeapons = () => {
    setFoodFilter(
      food.filter((w) => {
        let nameFilter = true;
        let typeFil = true;
        if (debouncedSearchTerm) {
          nameFilter =
            w.name.toUpperCase().indexOf(debouncedSearchTerm.toUpperCase()) >
            -1;
        }

        if (typeFilter && typeFilter !== "all") {
          typeFil = w.type === typeFilter;
        }

        return nameFilter && typeFil;
      })
    );
  };

  useEffect(() => {
    filterWeapons();
  }, [debouncedSearchTerm, typeFilter]);

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Cooking Recipes List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Discover all the cooking recipes and the best food to cook for your team.",
        })}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "food", defaultMessage: "Food" })}
      </h2>
      <div className="mb-4 flex flex-wrap justify-between">
        <SearchInput
          value={searchTerm}
          setValue={setSearchTerm}
          placeholder={t({ id: "search", defaultMessage: "Search..." })}
        />
        <div className="ml-3 mt-4 md:mt-0">
          {["all", "normal", "delicious", "suspicious", "special"].map(
            (type) => (
              <button
                key={type}
                className={clsx(
                  "mr-1 rounded border px-3 py-2 hover:border-gray-700 hover:bg-vulcan-800",
                  type === typeFilter
                    ? "border-gray-700 bg-vulcan-800"
                    : "border-gray-800"
                )}
                onClick={() => setTypeFilter(type)}
              >
                {t({ id: type, defaultMessage: type })}
              </button>
            )
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredFood.map((item) => (
          <FoodCard key={`${item.id}_${item.type}`} item={item} />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const dishesList = await genshinData.food({
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
    food.push({
      id: item.id,
      name: item.results.delicious.name,
      rarity: item.rarity,
      effect: item.results.delicious.effect,
      type: "delicious",
    });
    food.push({
      id: item.id,
      name: item.results.suspicious.name,
      rarity: item.rarity,
      effect: item.results.suspicious.effect,
      type: "suspicious",
    });

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

  return { props: { food, lngDict } };
};

export default FoodPage;
