import { useMemo } from "react";
import { GetStaticProps } from "next";
import { Column, useSortBy, useTable } from "react-table";

import GenshinData, { Artifact } from "genshin-data";
import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import StarRarity from "@components/StarRarity";
import clsx from "clsx";

type Props = {
  artifacts: Artifact[];
  artifacts1set: Artifact[];
  lngDict: Record<string, string>;
};

const ArtifactsPage = ({ artifacts, artifacts1set, lngDict }: Props) => {
  const [f, fStr] = useIntl(lngDict);

  const columns = useMemo<Column<Artifact>[]>(
    () => [
      {
        Header: "",
        accessor: "id",
        Cell: (row) => (
          <img
            height={54}
            width={54}
            src={`/_assets/artifacts/${row.value}.png`}
          />
        ),
      },
      {
        Header: fStr({ id: "name", defaultMessage: "Name" }),
        accessor: "name",
      },
      {
        Header: fStr({ id: "max_rarity", defaultMessage: "Max Rarity" }),
        accessor: "min_rarity",
        Cell: (row) => <StarRarity rarity={row.value} />,
      },
      {
        Header: fStr({ id: "2piece_bonus", defaultMessage: "2-Piece Bonus" }),
        accessor: "2pc",
        Cell: (row) => (
          <div
            className="max-w-sm"
            dangerouslySetInnerHTML={{ __html: row.value || "" }}
          />
        ),
      },
      {
        Header: fStr({ id: "4piece_bonus", defaultMessage: "4-Piece Bonus" }),
        accessor: "4pc",
        Cell: (row) => (
          <div
            className="max-w-sm"
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
  } = useTable({ columns, data: artifacts }, ...[useSortBy]);

  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {f({ id: "artifacts", defaultMessage: "Artifacts" })}
      </h2>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <h2 className="py-2 text-2xl font-semibold text-gray-200">
          {f({
            id: "2-4piece_artifact_sets",
            defaultMessage: "2-4 Piece Artifact Sets",
          })}
        </h2>
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
        <div className="mt-6">
          <h2 className="py-2 text-2xl font-semibold text-gray-200">
            {f({
              id: "1piece_artifact_sets",
              defaultMessage: "1-Piece Artifact Sets",
            })}
          </h2>
          <table className={"w-full"}>
            <thead>
              <tr>
                <th></th>
                <th>{f({ id: "name", defaultMessage: "Name" })}</th>
                <th>{f({ id: "max_rarity", defaultMessage: "Max Rarity" })}</th>
                <th>
                  {f({ id: "1piece_bonus", defaultMessage: "1-Piece Bonus" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {artifacts1set.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"
                  }
                >
                  <td>
                    <img
                      height={54}
                      width={54}
                      src={`/_assets/artifacts/${row.id}.png`}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>
                    <StarRarity rarity={row.max_rarity} />
                  </td>
                  <td>{row["1pc"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { default: lngDict = {} } = await import(`../locales/${locale}.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const artifacts = await genshinData.artifacts();
  const artifacts1set = artifacts.filter((a) => a["1pc"]);
  const artifacts4set = artifacts.filter((a) => !a["1pc"]);

  return {
    props: { artifacts: artifacts4set, artifacts1set: artifacts1set, lngDict },
    revalidate: 1,
  };
};

export default ArtifactsPage;
