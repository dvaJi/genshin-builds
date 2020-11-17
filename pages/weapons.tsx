import { useMemo } from "react";
import { GetStaticProps } from "next";
import { Column, useSortBy, useTable } from "react-table";

import weaponsData from "../utils/weapons.json";
import { Weapon } from "../interfaces/weapon";

type Props = {
  weapons: Weapon[];
};

const WeaponsPage = ({ weapons }: Props) => {
  const columns = useMemo<Column<Weapon>[]>(
    () => [
      {
        Header: "Weapon",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Rarity",
        accessor: "rarity",
      },
      {
        Header: "ATK",
        accessor: "base",
      },
      {
        Header: "Secondary",
        accessor: "secondary",
      },
      {
        Header: "Passive",
        accessor: "passive",
      },
      {
        Header: "Bonus",
        accessor: "bonus",
        Cell: (row) => <span dangerouslySetInnerHTML={{ __html: row.value }} />,
      },
      {
        Header: "Location",
        accessor: "location",
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
    <div className="bg-gray-900">
      <h2>Weaponms</h2>
      <div>
        <table {...getTableProps()}>
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
                <tr {...row.getRowProps()}>
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

export const getStaticProps: GetStaticProps = async () => {
  const weapons = weaponsData as Weapon[];
  return { props: { weapons } };
};

export default WeaponsPage;
