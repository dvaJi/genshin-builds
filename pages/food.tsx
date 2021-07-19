/* eslint-disable react/jsx-key, react-hooks/exhaustive-deps */
import clsx from "clsx";
import { useMemo } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Food } from "genshin-data";
import { Column, useSortBy, useTable } from "react-table";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";

type Props = {
  food: Food[];
};

const FoodPage = ({ food }: Props) => {
  const { t, tfn } = useIntl();
  const columns = useMemo<Column<Food>[]>(
    () => [
      {
        Header: "",
        accessor: "id",
        Cell: (row) => (
          <img
            height={54}
            width={54}
            src={`${IMGS_CDN}/food/${row.value}.png`}
            alt={row.value}
          />
        ),
      },
      {
        Header: tfn({ id: "name", defaultMessage: "Name" }),
        accessor: "name",
      },
      {
        Header: tfn({ id: "rarity", defaultMessage: "Rarity" }),
        accessor: "rarity",
        Cell: (row) => <StarRarity rarity={row.value} />,
      },
      {
        Header: tfn({ id: "effect", defaultMessage: "Effect" }),
        accessor: "results",
        Cell: (row) => row.value.normal.effect,
      },
    ],
    [food]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: food }, ...[useSortBy]);

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
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <table
          {...getTableProps()}
          className={clsx(getTableProps().className, "w-full")}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={
                    row.index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"
                  }
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const food = await genshinData.food({
    select: ["id", "name", "rarity", "results"],
  });

  return { props: { food, lngDict }, revalidate: 1 };
};

export default FoodPage;
