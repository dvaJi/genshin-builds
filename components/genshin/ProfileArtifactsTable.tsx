import { getUrlLQ } from "@lib/imgUrl";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo, useState } from "react";

export interface Props {
  data: any[];
}

function ProfileArtifactsTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "critValue", desc: true },
  ]);

  const newData = useMemo(() => {
    console.log("data", data);
    const sortedStats = (data: any) => {
      return Object.entries<{ value: number; count: number }>(data.subStats)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([key, value]) => ({ key, value: value.value }));
    };
    return data.flatMap((build) => [
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
    ]);
  }, [data]);
  console.log("newData", newData);

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

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          return (
            <div className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <img
                key={info.row.original.id}
                className=""
                src={getUrlLQ(`/artifacts/${info.row.original.id}.png`, 25, 25)}
                alt="Avatar"
              />
              {info.getValue<string>()}
            </div>
          );
        },
      },
      {
        header: "Main stat",
        cell: (info) => {
          const [label, value] = Object.entries<string>(
            info.row.original.mainStat
          )[0];
          return (
            <div
              className={clsx("rounded py-1 px-1 text-left text-xs text-white")}
            >
              {value} {label}
            </div>
          );
        },
      },
      {
        header: "Stat 1",
        cell: (info) => {
          const { key, value } = info.row.original.sortedStats[0];
          return (
            <div
              className={clsx("rounded py-1 px-1 text-left text-xs text-white")}
            >
              {value} {key}
            </div>
          );
        },
      },
      {
        header: "Stat 2",
        cell: (info) => {
          const { key, value } = info.row.original.sortedStats[1];
          return (
            <div
              className={clsx("rounded py-1 px-1 text-left text-xs text-white")}
            >
              {value} {key}
            </div>
          );
        },
      },
      {
        header: "Stat 3",
        cell: (info) => {
          const { key, value } = info.row.original.sortedStats[2];
          return (
            <div
              className={clsx("rounded py-1 px-1 text-left text-xs text-white")}
            >
              {value} {key}
            </div>
          );
        },
      },
      {
        header: "Stat 4",
        cell: (info) => {
          const { key, value } = info.row.original.sortedStats[3];
          return (
            <div
              className={clsx("rounded py-1 px-1 text-left text-xs text-white")}
            >
              {value} {key}
            </div>
          );
        },
      },
      {
        header: "Crit Value",
        accessorKey: "critValue",
        cell: (info) => (
          <span className={cvQuality(info.getValue<number>())}>
            {info.getValue<number>().toFixed(1)}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: newData,
    columns,
    state: {
      sorting,
      pagination: {
        pageSize: 20,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });
  // console.log(columns, data, table.getRowModel());

  return (
    <div className="card p-1">
      <table className="relative w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-left text-sm"
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
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
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
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
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex items-center gap-2">
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="rounded border p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
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
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ProfileArtifactsTable;
