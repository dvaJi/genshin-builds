import { useMemo } from "react";
import { GetStaticProps } from "next";
import { Column, useSortBy, useTable } from "react-table";

import GenshinData, { Weapon } from "genshin-data";
import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import StarRarity from "@components/StarRarity";
import clsx from "clsx";

interface WeaponsPageProps {
  weapons: Weapon[];
  lngDict: Record<string, string>;
}

const WeaponsPage = ({ weapons, lngDict }: WeaponsPageProps) => {
  const [f, fStr] = useIntl(lngDict);
  const columns = useMemo<Column<Weapon>[]>(
    () => [
      {
        Header: "",
        accessor: "id",
        Cell: (row) => (
          <img height={54} width={54} src={`/weapons/${row.value}.png`} />
        ),
      },
      {
        Header: fStr({ id: "weapon", defaultMessage: "Weapon" }),
        accessor: "name",
      },
      {
        Header: fStr({ id: "type", defaultMessage: "Type" }),
        accessor: "type",
      },
      {
        Header: fStr({ id: "rarity", defaultMessage: "Rarity" }),
        accessor: "rarity",
        Cell: (row) => <StarRarity rarity={row.value} />,
      },
      {
        Header: fStr({ id: "ATK", defaultMessage: "ATK" }),
        accessor: "base",
      },
      {
        Header: fStr({ id: "secondary", defaultMessage: "Secondary" }),
        accessor: "secondary",
      },
      {
        Header: fStr({ id: "passive", defaultMessage: "Passive" }),
        accessor: "passive",
      },
      {
        Header: fStr({ id: "bonus", defaultMessage: "Bonus" }),
        accessor: "bonus",
        Cell: (row) => (
          <div
            className="max-w-sm"
            dangerouslySetInnerHTML={{ __html: row.value || "" }}
          />
        ),
      },
      {
        Header: fStr({ id: "location", defaultMessage: "Location" }),
        accessor: "location",
        Cell: (row) => (
          <div
            className="w-10"
            dangerouslySetInnerHTML={{ __html: row.value || "" }}
          />
        ),
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
  } = useTable({ columns, data: weapons }, ...[useSortBy]);

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "weapons", defaultMessage: "Weapons" })}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const weapons = await genshinData.weapons();

  return { props: { weapons, lngDict }, revalidate: 1 };
};

export default WeaponsPage;
