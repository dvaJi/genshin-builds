"use client";

import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import useSWR from "swr";

import type { LeaderboardResponse } from "@app/api/hsr/leaderboard/route";
import { Badge } from "@app/components/ui/badge";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@app/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@app/components/ui/radio-group";
import { Skeleton } from "@app/components/ui/skeleton";
import { getLangData } from "@i18n/langData";
import { useRouter } from "@i18n/navigation";

import { regions } from "./utils";

const HSRLeaderBoardBuildsTable = dynamic(
  () => import("@components/hsr/LeaderBoardBuildsTable"),
  { ssr: false },
);

type Filters = {
  region: string;
  uid: string;
};

async function fetcher(url: string): Promise<LeaderboardResponse> {
  const res = await fetch(url);
  return await res.json();
}

export default function LeaderboardWrapper() {
  const t = useTranslations("HSR.leaderboard");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const regionParam = searchParams.get("region") || "all";
  const uidParam = searchParams.get("uid") || "";

  const [filters, setFilters] = useState<Filters>({
    region: regionParam,
    uid: uidParam,
  });

  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [displayedRange, setDisplayedRange] = useState<{
    start: number;
    end: number;
  }>({
    start: 1,
    end: 0,
  });

  const langData = getLangData(locale, "hsr");

  const { data, error } = useSWR<LeaderboardResponse>(
    `/api/hsr/leaderboard?lang=${langData}&page=${page}&region=${filters.region}&uid=${filters.uid}`,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      // Calculate displayed range based on page number
      const start = (parseInt(page) - 1) * 20 + 1;
      const end = start + data.data.length - 1;
      setDisplayedRange({ start, end });

      // Set total players from API response if available
      // This is a placeholder, actual implementation depends on API response format
      if (data.totalPlayers) {
        setTotalPlayers(data.totalPlayers);
      } else {
        // Fallback if not provided by API
        setTotalPlayers(end + 20); // Estimate based on current data
      }
    }
  }, [data, page]);

  function changePage(nextPage: number) {
    router.push(
      `/hsr/leaderboard?page=${nextPage}&region=${filters.region}&uid=${filters.uid}`,
    );
  }

  function applyFilters() {
    router.push(
      `/hsr/leaderboard?page=1&region=${filters.region}&uid=${filters.uid}`,
    );
  }

  function getRegionBadge(region: string) {
    const regionData = regions.find((r) => r.value === region) || regions[0];
    return (
      <Badge className={`${regionData.color} text-white`}>
        {regionData.label}
      </Badge>
    );
  }

  if (error) return <div>{t("failed_load_data")}</div>;

  return (
    <div>
      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label className="text-sm font-medium">{t("region")}</Label>
            <RadioGroup
              className="mt-1 grid grid-cols-5 gap-2"
              value={filters.region}
              onValueChange={(value) =>
                setFilters({ ...filters, region: value })
              }
            >
              {regions.map((region) => (
                <div key={region.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={region.value}
                    id={`region-${region.value}`}
                  />
                  <Label
                    htmlFor={`region-${region.value}`}
                    className="flex items-center"
                  >
                    {getRegionBadge(region.value)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div></div>
          <div>
            <Label className="text-sm font-medium">{t("search_by_uid")}</Label>
            <div className="mt-1 flex gap-2">
              <Input
                value={filters.uid}
                onChange={(e) =>
                  setFilters({ ...filters, uid: e.target.value })
                }
                placeholder={t("uid_placeholder")}
                className="max-w-xs"
              />
              <Button onClick={applyFilters}>
                <FaSearch className="mr-2" />
                {t("search")}
              </Button>
            </div>
          </div>

          {/* <div>
            <Label className="text-sm font-medium">{t("ranking")}</Label>
            <div className="mt-1">
              <RadioGroup
                className="grid grid-cols-2 gap-2"
                value="global"
                onValueChange={() => {}}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="global" id="ranking-global" />
                  <Label htmlFor="ranking-global">{t("global")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="region" id="ranking-region" disabled />
                  <Label htmlFor="ranking-region">{t("region")}</Label>
                </div>
              </RadioGroup>
            </div>
          </div> */}
        </div>
      </Card>

      {data && displayedRange.end > 0 && (
        <div className="mb-4 text-sm text-slate-300">
          {t("displaying", {
            start: displayedRange.start,
            end: displayedRange.end,
            total: totalPlayers,
          })}
        </div>
      )}

      {!data ? (
        <div className="card overflow-x-auto p-1">
          <table className="relative w-full">
            <thead>
              <tr>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="min-w-[70px] p-2">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="h-8 odd:bg-vulcan-300/10">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="p-2">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <HSRLeaderBoardBuildsTable data={data} />

          <Pagination className="my-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePage(Number(page) - 1)}
                  aria-disabled={page === "1"}
                  className={
                    page === "1" ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* First page */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => changePage(1)}
                  isActive={page === "1"}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Ellipsis for many pages */}
              {Number(page) > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Page before current if not first or second page */}
              {Number(page) > 2 && (
                <PaginationItem>
                  <PaginationLink onClick={() => changePage(Number(page) - 1)}>
                    {Number(page) - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page if not first page */}
              {Number(page) !== 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => e.preventDefault()}
                    isActive={true}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Next page if we have more data */}
              {data.data.length === 20 && (
                <PaginationItem>
                  <PaginationLink onClick={() => changePage(Number(page) + 1)}>
                    {Number(page) + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis for showing there are more pages */}
              {data.data.length === 20 &&
                totalPlayers > (Number(page) + 1) * 20 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

              {/* Last page if not current and we know total pages */}
              {totalPlayers > 0 &&
                Math.ceil(totalPlayers / 20) > Number(page) + 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => changePage(Math.ceil(totalPlayers / 20))}
                    >
                      {Math.ceil(totalPlayers / 20)}
                    </PaginationLink>
                  </PaginationItem>
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => changePage(Number(page) + 1)}
                  aria-disabled={data.data.length < 20}
                  className={
                    data.data.length < 20
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
