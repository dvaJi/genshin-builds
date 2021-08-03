/* eslint-disable react/jsx-key, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import GenshinData from "genshin-data";
import clsx from "clsx";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import SearchInput from "@components/SearchInput";
import FoodCard from "@components/FoodCard";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import useDebounce from "@hooks/use-debounce";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";

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
  const { t, tfn } = useIntl();

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
        fn={tfn}
        pageTitle={tfn({
          id: "title.food",
          defaultMessage: "Genshin Impact Cooking Recipes List",
        })}
        pageDescription={tfn({
          id: "title.food.description",
          defaultMessage:
            "Discover all the cooking recipes and the best food to cook for your team.",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "food", defaultMessage: "Food" })}
      </h2>
      <div className="flex flex-wrap justify-between mb-4">
        <SearchInput
          value={searchTerm}
          setValue={setSearchTerm}
          placeholder={tfn({ id: "search", defaultMessage: "Search..." })}
        />
        <div className="ml-3 mt-4 md:mt-0">
          {["all", "normal", "delicious", "suspicious", "special"].map(
            (type) => (
              <button
                key={type}
                className={clsx(
                  "border px-3 py-2 rounded hover:border-gray-700 hover:bg-vulcan-800 mr-1",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredFood.map((item) => (
          <FoodCard key={`${item.id}_${item.type}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
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
