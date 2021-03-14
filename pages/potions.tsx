import clsx from "clsx";
import { useMemo } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Potion } from "genshin-data";
import { Column, useSortBy, useTable } from "react-table";

import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";

type Props = {
  potions: Potion[];
  lngDict: Record<string, string>;
};

const PotionsPage = ({ potions, lngDict }: Props) => {
  const [f, fStr] = useIntl(lngDict);
  const columns = useMemo<Column<Potion>[]>(
    () => [
      {
        Header: "",
        accessor: "id",
        Cell: (row) => (
          <img
            height={54}
            width={54}
            src={`/_assets/potions/${row.value}.png`}
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
        Cell: (row) => (row.value ? <StarRarity rarity={row.value} /> : ""),
      },
      {
        Header: fStr({ id: "effect", defaultMessage: "Effect" }),
        accessor: "effect",
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
  } = useTable({ columns, data: potions }, ...[useSortBy]);

  return (
    <div>
      <Metadata
        fn={fStr}
        pageTitle={fStr({
          id: "title.potions",
          defaultMessage: "Genshin Impact Potions List",
        })}
        pageDescription={fStr({
          id: "title.potions.description",
          defaultMessage:
            "Discover all the alchemy recipes and the best potions and oils to use for your team.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "potions", defaultMessage: "Potions" })}
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
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const potions = await genshinData.potions();

  return { props: { potions, lngDict }, revalidate: 1 };
};

export default PotionsPage;
