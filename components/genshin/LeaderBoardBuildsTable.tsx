import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  PaginationState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, type Dispatch, type SetStateAction } from "react";

import Badge from "@components/ui/Badge";
import useIntl from "@hooks/use-intl";
import { getUrlLQ } from "@lib/imgUrl";
import { ArtifactType, Build, Profile } from "interfaces/profile";
import StatIcon from "./StatIcon";

export interface Props {
  data: (Build & { player: Profile })[];
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

const cvQuality = (cv: number) => {
  if (cv < 180) {
    return "text-slate-400";
  } else if (cv >= 180 && cv < 200) {
    return "text-blue-400";
  } else if (cv >= 200 && cv < 220) {
    return "text-purple-400";
  } else if (cv >= 220 && cv < 240) {
    return "text-yellow-500";
  } else if (cv >= 240 && cv < 250) {
    return "text-yellow-400";
  } else if (cv >= 250 && cv < 300) {
    return "text-cyan-400";
  } else if (cv >= 300) {
    return "text-red-500";
  }
};

const columns: ColumnDef<Build & { player: Profile }>[] = [
  {
    header: "owner",
    cell: (info) => {
      return (
        <Link
          href={`/profile/${info.row.original.player.uuid}`}
          className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          <Badge>{info.row.original.player.region}</Badge>
          {info.row.original.player.nickname}
        </Link>
      );
    },
  },
  {
    header: "name",
    accessorKey: "name",
    cell: (info) => {
      return (
        <div className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <img
            src={getUrlLQ(`/profile/${info.row.original.avatarId}.png`, 25, 25)}
            width={25}
            height={25}
            alt="Avatar"
          />
          {info.getValue<string>()}
        </div>
      );
    },
  },
  {
    header: "constellation",
    accessorKey: "constellation",
    cell: (info) => {
      const value = info.getValue();
      let customClass = "w-[14%] bg-gray-600";
      switch (value) {
        case 1:
          customClass = "w-[25%] bg-cyan-600";
          break;
        case 2:
          customClass = "w-[40%] bg-cyan-600";
          break;
        case 3:
          customClass = "w-[55%] bg-cyan-600";
          break;
        case 4:
          customClass = "w-[70%] bg-cyan-600";
          break;
        case 5:
          customClass = "w-[80%] bg-cyan-600";
          break;
        case 6:
          customClass = "w-[90%] bg-yellow-600";
          break;
      }

      return (
        <div
          className={clsx(
            "min-w-[25px] rounded px-1 py-1 text-left text-xs text-white",
            customClass
          )}
        >{`C${value}`}</div>
      );
    },
  },
  {
    header: "weapon",
    cell: (info) => {
      return (
        <div
          className="relative w-7"
          title={`${info.row.original.weapon.name} R${info.row.original.weapon.refinement}`}
        >
          <img
            src={getUrlLQ(
              `/weapons/${info.row.original.weapon.id}.png`,
              25,
              25
            )}
            width={25}
            height={25}
            alt={info.row.original.weapon.name}
          />
          <span className="absolute bottom-0 right-0 z-10 text-xxs shadow-black text-shadow">
            R{info.row.original.weapon.refinement}
          </span>
        </div>
      );
    },
  },
  {
    header: "artifact",
    cell: (info) => {
      const pieces = info.row.original.sets.length === 1 ? 4 : 2;
      return (
        <div className="flex">
          {info.row.original.sets.map((set) => (
            <div
              key={set.id}
              className="relative w-7"
              title={`${set.name} ${pieces}PC`}
            >
              <img
                src={getUrlLQ(`/artifacts/${set.id}.png`, 25, 25)}
                width={25}
                height={25}
                alt={set.name}
              />
              <span className="absolute bottom-0 right-0 z-10 text-xxs text-green-200 shadow-black text-shadow">
                {pieces}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    header: "critvalue",
    accessorKey: "critValue",
    cell: (info) => {
      const cv = info.getValue<number>();
      return (
        <div className="text-xs">
          {(info.row.original.stats["CRIT Rate"] * 100).toFixed(1)} :{" "}
          {(info.row.original.stats["CRIT DMG"] * 100).toFixed(1)}
          <span className={clsx("ml-2", cvQuality(cv))}>{cv.toFixed(0)}</span>
        </div>
      );
    },
  },
  {
    header: "Max HP",
    accessorKey: "stats.Max HP",
    cell: (info) => info.row.original.stats["Max HP"].toFixed(0),
  },
  {
    header: "ATK",
    accessorKey: "stats.ATK",
    cell: (info) => info.row.original.stats["ATK"].toFixed(0),
  },
  {
    header: "DEF",
    accessorKey: "stats.DEF",
    cell: (info) => info.row.original.stats["DEF"].toFixed(0),
  },
  {
    header: "EM",
    accessorKey: "stats.Elemental Mastery",
    cell: (info) => info.row.original.stats["Elemental Mastery"].toFixed(0),
  },
  {
    header: "ER%",
    accessorKey: "stats.Energy Recharge",
    cell: (info) =>
      (info.row.original.stats["Energy Recharge"] * 100).toFixed(1) + "%",
  },
];

function LeaderBoardBuildsTable({ data, pagination, setPagination }: Props) {
  const { t } = useIntl("profile");
  // console.log("re-rendering LeaderBoardBuildsTable");

  const table = useReactTable({
    data,
    columns,
    pageCount: data.length,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: true,
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
                    className="min-w-[70px] text-left text-sm"
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
          {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr
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
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="my-4 flex items-center justify-center gap-2 text-sm text-slate-300">
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <span className="mx-2 text-lg">
          {table.getState().pagination.pageIndex + 1}
        </span>
        <button
          className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

const renderSubComponent = ({ row }: { row: Row<Build> }) => {
  const data = row.original;

  const pieces = data.sets.length === 1 ? 4 : 2;

  const generalStats = {
    "Max HP": data.stats["Max HP"].toFixed(0),
    ATK: data.stats.ATK.toFixed(0),
    DEF: data.stats.DEF.toFixed(0),
    "Elemental Mastery": data.stats["Elemental Mastery"].toFixed(0),
    "Crit Rate": `${(data.stats["CRIT Rate"] * 100).toFixed(1)}%`,
    "Crit DMG": `${(data.stats["CRIT DMG"] * 100).toFixed(1)}%`,
    "Energy Recharge": `${(data.stats["Energy Recharge"] * 100).toFixed(1)}%`,
  };

  const dmgStats = {
    "Pyro DMG Bonus": data.stats["Pyro DMG Bonus"],
    "Electro DMG Bonus": data.stats["Electro DMG Bonus"],
    "Cryo DMG Bonus": data.stats["Cryo DMG Bonus"],
    "Geo DMG Bonus": data.stats["Geo DMG Bonus"],
    "Dendro DMG Bonus": data.stats["Dendro DMG Bonus"],
    "Anemo DMG Bonus": data.stats["Anemo DMG Bonus"],
    "Hydro DMG Bonus": data.stats["Hydro DMG Bonus"],
    "Physical DMG Bonus": data.stats["Physical DMG Bonus"],
  };

  const artifacts = {
    flower: data.flower,
    plume: data.plume,
    sands: data.sands,
    goblet: data.goblet,
    circlet: data.circlet,
  };

  const calcCv = (artifact?: ArtifactType) => {
    if (!artifact) return 0;

    const critDMG = artifact.subStats["CRIT DMG"]?.value || 0;
    const critRate = artifact.subStats["CRIT Rate"]?.value || 0;
    return critDMG + critRate * 2;
  };

  const cvQuality = (cv: number) => {
    if (cv < 10) {
      return ["text-slate-400", "border-slate-400"];
    } else if (cv >= 10 && cv < 20) {
      return ["text-blue-400", "border-blue-400"];
    } else if (cv >= 20 && cv < 30) {
      return ["text-purple-400", "border-purple-400"];
    } else if (cv >= 30 && cv < 40) {
      return ["text-yellow-500", "border-yellow-500"];
    } else if (cv >= 40 && cv < 50) {
      return ["text-yellow-400", "border-yellow-400"];
    } else if (cv >= 50 && cv < 70) {
      return ["text-cyan-400", "border-cyan-400"];
    }
    //  else if (cv >= 70) {
    return ["text-red-500", "border-red-500"];
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-2 mt-1 flex w-80 flex-col bg-vulcan-700 p-2">
        <div className="flex justify-center">
          Level {data.level} / Ascension {data.ascension}
        </div>
        <div className="flex justify-between border-b border-vulcan-600">
          <div className="flex">
            <img
              src={getUrlLQ(`/weapons/${data.weapon.id}.png`, 25, 25)}
              width={25}
              height={25}
              alt={data.weapon.name}
            />
            <span>{data.weapon.name}</span>
            <span className="absolute bottom-0 right-0 z-10 text-xxs shadow-black text-shadow">
              R{data.weapon.refinement}
            </span>
          </div>
          <div>
            <span>Level {data.weapon.level}</span>
            <span className="">/{data.weapon.promoteLevel}</span>
          </div>
        </div>
        {data.sets.map((set) => (
          <div
            key={set.id}
            className="flex justify-between border-b border-vulcan-600"
            title={`${set.name} ${pieces}PC`}
          >
            <div className="flex">
              <img
                src={getUrlLQ(`/artifacts/${set.id}.png`, 36, 36)}
                width={25}
                height={25}
                alt={set.name}
              />
              <span>{set.name}</span>
            </div>
            <div>{pieces} PC</div>
          </div>
        ))}
        {Object.entries(generalStats).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between border-b border-vulcan-600"
          >
            <div>{key}</div>
            <div className="ml-2">{value}</div>
          </div>
        ))}
        {Object.entries(dmgStats)
          .filter((a) => a[1] >= 0.001)
          .map(([key, value]) => (
            <div key={key} className="flex  justify-between">
              <div>{key}</div>
              <div className="ml-2">{(value * 100).toFixed(1)}%</div>
            </div>
          ))}
      </div>
      <div className="mb-4 flex items-center justify-center">
        {Object.entries(artifacts)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => (
            <div
              key={key}
              className={clsx(
                "group relative mx-2 flex overflow-hidden rounded-lg border shadow-2xl",
                cvQuality(calcCv(value))[1]
              )}
            >
              <div className="h-32 w-24">
                <span
                  className={clsx(
                    "absolute left-0 top-0 z-10 m-1 bg-gray-900/50 px-2 text-xxs shadow-black text-shadow",
                    cvQuality(calcCv(value))[0]
                  )}
                >
                  CV {calcCv(value).toFixed(1)}
                </span>
                <div className="gradient-image overflow-hidden">
                  <img
                    src={getUrlLQ(`/artifacts/${value?.id}.png`, 200, 200)}
                    className="absolute -left-9 -top-5 transform transition-all group-hover:scale-125"
                    width={200}
                    height={200}
                    alt={value?.name}
                    title={value?.name}
                  />
                </div>
                <span className="absolute bottom-0 left-0 m-1 rounded bg-gray-900/50 px-2 py-1 text-xs shadow-black text-shadow">
                  {Object.entries(value?.mainStat ?? {})
                    .map(([key, value]) => `${key} ${value}`)
                    .join(" ")}
                </span>
              </div>
              <div className="mr-2 mt-4">
                {Object.entries(value?.subStats ?? {}).map(([key, values]) => (
                  <div
                    key={key}
                    className={clsx("flex items-center text-white", {
                      "opacity-100": values.count >= 4,
                      "opacity-90": values.count >= 3 && values.count < 4,
                      "opacity-60": values.count >= 2 && values.count < 3,
                      "opacity-40": values.count >= 1 && values.count < 2,
                      "opacity-20": values.count < 1,
                    })}
                  >
                    <span className="mr-px text-xxs">{values.count}</span>
                    <StatIcon type={key} width={16} height={16} />
                    <span className="mx-2 text-slate-50">{values.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeaderBoardBuildsTable;
