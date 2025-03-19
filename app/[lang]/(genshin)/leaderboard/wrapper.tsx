"use client";

import { Build, Profile } from "interfaces/profile";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import useSWR from "swr";

import { getLangData } from "@i18n/langData";
import { useRouter } from "@i18n/navigation";
import type { Character } from "@interfaces/genshin";

import Filters from "./filters";

const LeaderBoardBuildsTable = dynamic(
  () => import("@components/genshin/LeaderBoardBuildsTable"),
  { ssr: false },
);

type Props = {
  characters: Character[];
};

type Filters = {
  characters: string[];
};

async function fetcher(url: string) {
  const res = await fetch(url);
  return await res.json();
}

export default function LeaderboardWrapper({ characters }: Props) {
  const t = useTranslations("Genshin.leaderboard");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const charactersParams = searchParams.get("characters") || "";

  const langData = getLangData(locale, "genshin");

  const { data, error } = useSWR<(Build & { player: Profile })[]>(
    `/api/genshin/leaderboard?lang=${langData}&characters=${charactersParams}&page=${page}`,
    fetcher,
  );

  function changePage(nextPage: number) {
    if (charactersParams) {
      router.push(
        `/${locale}/leaderboard?page=${nextPage}&characters=${charactersParams}`,
      );
    } else {
      router.push(`/${locale}/leaderboard?page=${nextPage}`);
    }
  }

  function handleApplyFilters(filters: Filters) {
    const characters = filters.characters.join(",");
    router.push(`/${locale}/leaderboard?page=1&characters=${characters}`);
  }

  if (error) return <div>{t("failed_load_data")}</div>;

  return (
    <div>
      <div className="card">
        <Filters characters={characters} onApplyFilters={handleApplyFilters} />
      </div>
      {!data ? (
        <div className="my-8 flex items-center justify-center text-2xl text-gray-400">
          <FaSpinner className="mr-2 animate-spin" />
          <span>{t("loading_data")}</span>
        </div>
      ) : (
        <>
          <LeaderBoardBuildsTable data={data} />
          <div className="my-4 flex items-center justify-center gap-2 text-sm text-slate-300">
            <button
              className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
              onClick={() => changePage(Number(page) - 1)}
              disabled={page === "1"}
            >
              {t("previous")}
            </button>
            {/* <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span> */}
            <button
              className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
              onClick={() => changePage(Number(page) + 1)}
              disabled={data.length < 20}
            >
              {t("next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
