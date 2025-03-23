"use client";

import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { MdOutlineCalendarToday } from "react-icons/md";

import { regions } from "@app/[lang]/hsr/leaderboard/utils";
import type {
  LeaderboardData,
  LeaderboardResponse,
} from "@app/api/hsr/leaderboard/route";
import { Badge } from "@app/components/ui/badge";
import Image from "@components/hsr/Image";
import { DataTable } from "@components/ui/data-table";
import { Link } from "@i18n/navigation";
import { getHsrUrl } from "@lib/imgUrl";
import { ColumnDef } from "@tanstack/react-table";

type Props = {
  data: LeaderboardResponse;
};

export default function LeaderBoardBuildsTable({ data }: Props) {
  const t = useTranslations("HSR.leaderboard");

  function getRegionBadge(region: string) {
    const regionData = regions.find((r) => r.value === region) || regions[0];
    return (
      <Badge className={`${regionData.color} text-white`}>
        {regionData.label}
      </Badge>
    );
  }

  // Early return if we don't have any data
  if (!data || data.data.length === 0) {
    return (
      <div className="mx-auto max-w-7xl p-8 text-center">
        <p className="text-lg text-slate-300">{t("no_data")}</p>
      </div>
    );
  }

  const columns: ColumnDef<LeaderboardData>[] = [
    {
      id: "rank",
      header: t("rank"),
      cell: ({ row }) => {
        return <div className="text-center font-bold">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "nickname",
      header: t("player"),
      cell: ({ row }) => {
        const player = row.original;
        return (
          <div className="flex items-center gap-3">
            <Image
              className="shadow-1 rounded-full border-2 border-accent"
              width={40}
              height={40}
              alt="Profile"
              src={`/profiles/${player.profilePictureId}.png`}
            />
            <div>
              <div className="flex items-center gap-2">
                {getRegionBadge(player.region.toLowerCase())}
                <Link
                  href={`/hsr/showcase/profile/${player.uuid}`}
                  className="hover:primary block font-semibold text-accent"
                >
                  {player.nickname}
                </Link>
              </div>
              {/* <div className="text-xs">UID: {player.uuid}</div> */}
              {player.signature && (
                <div className="mt-1 max-w-[220px] truncate text-xs italic">
                  "{player.signature}"
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "finishAchievementNum",
      header: t("achievements"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <img
              src={getHsrUrl("/achievements/1.png", 24, 24)}
              alt="achievements"
              className="mr-2 h-6 w-6"
            />
            <span className="font-semibold">
              {row.original.finishAchievementNum}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "level",
      header: t("trailblaze_level"),
      cell: ({ row }) => {
        return (
          <div>
            {t("level")} {row.original.level}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: t("last_updated"),
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return (
          <div className="flex items-center text-sm">
            <MdOutlineCalendarToday className="mr-1" />
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      {data.data.length < 5 && (
        <div className="mb-4 rounded-md bg-vulcan-700 p-4 text-sm text-slate-300">
          <p>{t("limited_data")}</p>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data.data}
        defaultSorting={[{ id: "finishAchievementNum", desc: true }]}
        disablePagination={true}
      />
    </div>
  );
}
