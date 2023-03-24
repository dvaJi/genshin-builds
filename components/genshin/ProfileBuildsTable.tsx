import { getUrlLQ } from "@lib/imgUrl";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Fragment, useMemo, useState } from "react";

export interface Props {
  data: any[];
}

function ProfileBuildsTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "critValue",
      desc: true,
    },
  ]);

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

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          return (
            <div className="flex place-items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <img
                key={info.row.original.avatarId}
                src={getUrlLQ(
                  `/profile/${info.row.original.avatarId}.png`,
                  25,
                  25
                )}
                alt="Avatar"
              />
              {info.getValue<string>()}
            </div>
          );
        },
      },
      {
        header: "Constellation",
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
                "rounded py-1 px-1 text-left text-xs text-white",
                customClass
              )}
            >{`C${value}`}</div>
          );
        },
      },
      {
        header: "Weapon",
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
        header: "Artifact",
        cell: (info) => {
          const pieces = info.row.original.sets.length === 1 ? 4 : 2;
          return (
            <div className="flex">
              {info.row.original.sets.map((set: any) => (
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
        header: "Crit Value",
        accessorKey: "critValue",
        cell: (info) => {
          const cv = info.row.original.critValue.toFixed(1);
          return (
            <div className="text-xs">
              {(info.row.original.stats["CRIT Rate"] * 100).toFixed(1)} :{" "}
              {(info.row.original.stats["CRIT DMG"] * 100).toFixed(1)}
              <span className={clsx("ml-2", cvQuality(cv))}>{cv}</span>
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
    ],
    []
  );

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
                <Fragment key={row.id}>
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
                  {row.getIsExpanded() && (
                    <tr key={row.id + "-sub"}>
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
    </div>
  );
}

const renderSubComponent = ({ row }: { row: Row<any> }) => {
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

  const calcCv = (artifact: any) => {
    const critDMG = artifact.subStats["CRIT DMG"]?.value || 0;
    const critRate = artifact.subStats["CRIT Rate"]?.value || 0;
    return critDMG + critRate * 2;
  };

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

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex">
            <span>{data.name}</span>
            <div className="relative">
              <span className="refinement-display">
                <span className={"strike-through"}>
                  C{data.constellation ?? 0}
                </span>
              </span>
            </div>
          </div>
          <div className="">
            Level {data.level}
            <span className="">/{data.ascension}</span>
          </div>
        </div>
        <div className="flex justify-between">
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
        {Object.entries(generalStats).map(([key, value]) => (
          <div key={key} className="flex  justify-between">
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
        {data.sets.map((set: any) => (
          <div key={set.id} className="flex" title={`${set.name} ${pieces}PC`}>
            <img
              src={getUrlLQ(`/artifacts/${set.id}.png`, 36, 36)}
              width={36}
              height={36}
              alt={set.name}
            />
            <span>{set.name}</span>
            <span className="text-green-200 shadow-black text-shadow">
              x{pieces}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {Object.entries(artifacts).map(([key, value]) => (
          <div key={key} className="flex">
            <img
              src={getUrlLQ(`/artifacts/${value.id}.png`, 36, 36)}
              width={36}
              height={36}
              alt={value.name}
            />
            <span>{value.name}</span>
            <span>
              {Object.entries(value.mainStat)
                .map(([key, value]) => `${key} ${value}`)
                .join(" ")}
            </span>
            <div>
              {Object.entries(value.subStats).map(([key, values]: any) => (
                <div key={key} className="flex">
                  <span>{key}</span>
                  <span className="ml-2">
                    {values.value} x{values.count}
                  </span>
                </div>
              ))}
              CV {calcCv(value).toFixed(1)} - {cvQuality(calcCv(value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBuildsTable;
