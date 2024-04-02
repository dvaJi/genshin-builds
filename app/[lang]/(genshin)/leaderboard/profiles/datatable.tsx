"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import TimeAgo from "@components/TimeAgo";
import Badge from "@components/ui/Badge";
import useIntl from "@hooks/use-intl";
import type { SelectPlayer } from "@lib/db/schema";
import { getUrlLQ } from "@lib/imgUrl";
import { regionParse } from "@utils/leaderboard-enc";

const columns: ColumnDef<SelectPlayer>[] = [
  {
    header: "Nickname",
    cell: (info) => {
      return (
        <Link
          href={`/profile/${info.row.original.uuid}`}
          className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap hover:text-white"
        >
          <Badge className="w-10 text-center">
            {regionParse(info.row.original.uuid)}
          </Badge>
          <img
            src={getUrlLQ(
              `/profile/${info.row.original.profileCostumeId || info.row.original.profilePictureId}.png`,
              25,
              25
            )}
            width={25}
            height={25}
            alt="Avatar"
          />
          {info.row.original.nickname}
        </Link>
      );
    },
  },
  {
    header: "Signature",
    accessorKey: "signature",
  },
  {
    header: "Adventure Rank",
    cell: (info) => {
      return <Badge>AR{info.row.original.level}</Badge>;
    },
  },
  {
    header: "Achievements",
    cell: (info) => {
      return (
        <div className="relative flex items-center justify-center">
          <img
            src={getUrlLQ(`/achievements_icon.webp`, 25, 25)}
            width={25}
            height={25}
            alt="Achievements"
            className="mr-2 inline-block h-6 w-6"
          />
          <span className="inline-block">
            {info.row.original.finishAchievementNum}
          </span>
        </div>
      );
    },
  },
  {
    header: "Characters",
    accessorKey: "charactersCount",
  },
  {
    header: "Spiral Abyss",
    cell: (info) => {
      const towerFloorIndex = info.row.original.towerFloorIndex;
      const towerLevelIndex = info.row.original.towerLevelIndex;
      return (
        <div className="text-xs">
          {towerFloorIndex}-{towerLevelIndex}
        </div>
      );
    },
  },
  {
    header: "Last update",
    cell: (info) => (
      <TimeAgo date={info.row.original.updatedAt.toISOString()} />
    ),
  },
];

type Props = {
  data: SelectPlayer[];
};

export function ProfileTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "Achievements",
      desc: true,
    },
  ]);
  const { t } = useIntl("profile");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
                    className={clsx("min-w-[70px] text-left text-sm", {
                      "bg-black/20": header.column.getIsSorted(),
                    })}
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
                        {t({
                          id: flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) as any,
                          defaultMessage: flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ) as any,
                        })}
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="h-8 cursor-pointer odd:bg-vulcan-300/10 hover:bg-vulcan-50/20"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className={
                      cell.column.getIsSorted()
                        ? "bg-black/20 text-white"
                        : "px-2"
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
