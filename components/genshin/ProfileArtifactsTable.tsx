"use client";

import clsx from "clsx";
import { ArtifactType, Build } from "interfaces/profile";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Image from "./Image";

export interface Props {
  data: Build[];
}

const cvQuality = (cv: number) => {
  if (cv < 10) {
    return "text-slate-400";
  } else if (cv >= 10 && cv < 20) {
    return "text-blue-400";
  } else if (cv >= 20 && cv < 30) {
    return "text-purple-400";
  } else if (cv >= 30 && cv < 40) {
    return "text-yellow-500";
  } else if (cv >= 40 && cv < 50) {
    return "text-yellow-400";
  } else if (cv >= 50 && cv < 70) {
    return "text-cyan-400";
  } else if (cv >= 70) {
    return "text-red-500";
  }
};
const columns: ColumnDef<any>[] = [
  {
    header: "name",
    accessorKey: "name",
    cell: (info) => {
      return (
        <div className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <Image
            key={info.row.original.id}
            className=""
            src={`/artifacts/${info.row.original.id}.png`}
            alt={info.getValue<string>()}
            width={25}
            height={25}
          />
          {info.getValue<string>()}
        </div>
      );
    },
  },
  {
    header: "mainstat",
    cell: (info) => {
      if (!info.row.original.mainStat) return null;
      const [label, value] = Object.entries<string>(
        info.row.original.mainStat,
      )[0];
      return (
        <div className={clsx("rounded px-1 py-1 text-left text-xs text-white")}>
          {value} {label}
        </div>
      );
    },
  },
  {
    header: "stat1",
    cell: (info) => {
      if (!info.row.original.sortedStats[0]) return null;
      const { key, value } = info.row.original.sortedStats[0];
      return (
        <div className={clsx("rounded px-1 py-1 text-left text-xs text-white")}>
          {value} {key}
        </div>
      );
    },
  },
  {
    header: "stat2",
    cell: (info) => {
      if (!info.row.original.sortedStats[1]) return null;
      const { key, value } = info.row.original.sortedStats[1];
      return (
        <div className={clsx("rounded px-1 py-1 text-left text-xs text-white")}>
          {value} {key}
        </div>
      );
    },
  },
  {
    header: "stat3",
    cell: (info) => {
      if (!info.row.original.sortedStats[2]) return null;
      const { key, value } = info.row.original.sortedStats[2];
      return (
        <div className={clsx("rounded px-1 py-1 text-left text-xs text-white")}>
          {value} {key}
        </div>
      );
    },
  },
  {
    header: "stat4",
    cell: (info) => {
      if (!info.row.original.sortedStats[3]) return null;
      const { key, value } = info.row.original.sortedStats[3];
      return (
        <div className={clsx("rounded px-1 py-1 text-left text-xs text-white")}>
          {value} {key}
        </div>
      );
    },
  },
  {
    header: "critValue",
    cell: (info) => {
      const cv = info.row.original.critValue ?? 0;
      if (!cv) return null;
      return <span className={cvQuality(cv)}>{cv.toFixed(1)}</span>;
    },
  },
];

function ProfileArtifactsTable({ data }: Props) {
  const t = useTranslations("Genshin.profile");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "critValue", desc: true },
  ]);

  const newData = useMemo(() => {
    const sortedStats = (data?: ArtifactType) => {
      if (!data) return [];
      return Object.entries<{ value: number; count: number }>(data.subStats)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([key, value]) => ({ key, value: value.value }));
    };
    return data
      .filter((build) => build.sets.length > 0)
      .flatMap((build) => [
        {
          ...build.flower,
          sortedStats: sortedStats(build.flower),
        },
        {
          ...build.plume,
          sortedStats: sortedStats(build.plume),
        },
        {
          ...build.sands,
          sortedStats: sortedStats(build.sands),
        },
        {
          ...build.goblet,
          sortedStats: sortedStats(build.goblet),
        },
        {
          ...build.circlet,
          sortedStats: sortedStats(build.circlet),
        },
      ])
      .filter((artifact) => artifact.id !== undefined);
  }, [data]);

  const table = useReactTable({
    data: newData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: process.env.NODE_ENV === "development",
  });

  return (
    <div className="card overflow-x-auto p-1">
      <table className="relative w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="min-w-[120px] text-left text-sm"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {t(
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          ) as any,
                        )}
                        {{
                          asc: " ▴",
                          desc: " ▾",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="text-sm text-slate-300">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="h-8 cursor-pointer odd:bg-vulcan-300/10 hover:bg-vulcan-50/20"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="my-4 flex items-center justify-center gap-2 text-sm">
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>{t("page")}</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | {t("goto")}:{" "}
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 rounded border p-1"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          className="rounded border border-vulcan-600 p-1"
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {t("show", { pageSize: pageSize.toString() })}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProfileArtifactsTable;
