"use client";

import clsx from "clsx";
import { FoodItem } from "interfaces/genshin/food";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import SearchInput from "@components/SearchInput";
import FoodCard from "@components/genshin/FoodCard";
import useDebounce from "@hooks/use-debounce";

type Props = {
  food: FoodItem[];
};

export default function GenshinFoodList({ food }: Props) {
  const [filteredFood, setFoodFilter] = useState(food);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const t = useTranslations("Genshin.food");

  useEffect(() => {
    const filterFood = () => {
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
        }),
      );
    };
    filterFood();
  }, [debouncedSearchTerm, food, typeFilter]);

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-between">
        <SearchInput
          value={searchTerm}
          setValue={setSearchTerm}
          placeholder={t("search")}
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
                    : "border-gray-800",
                )}
                onClick={() => setTypeFilter(type)}
              >
                {t(type)}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredFood.map((item) => (
          <FoodCard key={`${item.id}_${item.type}`} item={item} />
        ))}
      </div>
    </>
  );
}
