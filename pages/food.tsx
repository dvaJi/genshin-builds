import clsx from "clsx";
import { useMemo } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Food } from "genshin-data";
import { Column, useSortBy, useTable } from "react-table";

import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";

type Props = {
  food: Food[];
  lngDict: Record<string, string>;
};

const FoodPage = ({ food, lngDict }: Props) => {
  const [f, fStr] = useIntl(lngDict);
  const columns = useMemo<Column<Food>[]>(
    () => [
      {
        Header: "",
        accessor: "id",
        Cell: (row) => (
          <img
            height={54}
            width={54}
            src={`/_assets/food/${row.value}.png`}
            alt={row.value}
          />
        ),
      },
      {
        Header: fStr({ id: "name", defaultMessage: "Name" }),
        accessor: "name",
      },
      {
        Header: fStr({ id: "rarity", defaultMessage: "Rarity" }),
        accessor: "rarity",
        Cell: (row) => <StarRarity rarity={row.value} />,
      },
      {
        Header: fStr({ id: "effect", defaultMessage: "Effect" }),
        accessor: "effect",
      },
      {
        Header: fStr({ id: "character", defaultMessage: "Character" }),
        accessor: "character",
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: food }, ...[useSortBy]);

  return (
    <div>
      <Metadata
        fn={fStr}
        pageTitle={fStr({
          id: "title.food",
          defaultMessage: "Genshin Impact Cooking Recipes List",
        })}
        pageDescription={fStr({
          id: "title.food.description",
          defaultMessage:
            "Discover all the cooking recipes and the best food to cook for your team.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "food", defaultMessage: "Food" })}
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
  const lngDict = getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const food = await genshinData.food();

  return { props: { food, lngDict }, revalidate: 1 };
};

export default FoodPage;
