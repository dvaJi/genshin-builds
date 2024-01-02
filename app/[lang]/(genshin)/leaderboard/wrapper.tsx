"use client";

import type { Character } from "@interfaces/genshin";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import useSWR from "swr";

import useIntl from "@hooks/use-intl";
import { Build, Profile } from "interfaces/profile";
import Filters from "./filters";

const LeaderBoardBuildsTable = dynamic(
  () => import("@components/genshin/LeaderBoardBuildsTable"),
  { ssr: false }
);

type Props = {
  characters: Character[];
  locale: string;
};

type Filters = {
  characters: string[];
};

async function fetcher(url: string) {
  const res = await fetch(url);
  return await res.json();
}

export default function LeaderboardWrapper({ characters, locale }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const charactersParams = searchParams.get("characters") || "";

  const { localeGI } = useIntl("leaderboard");
  const { data, error } = useSWR<(Build & { player: Profile })[]>(
    `/api/genshin/leaderboard?lang=${localeGI}&characters=${charactersParams}&page=${page}`,
    fetcher
  );

  function changePage(nextPage: number) {
    if (charactersParams) {
      router.push(
        `/${locale}/leaderboard?page=${nextPage}&characters=${charactersParams}`
      );
    } else {
      router.push(`/${locale}/leaderboard?page=${nextPage}`);
    }
  }

  function handleApplyFilters(filters: Filters) {
    const characters = filters.characters.join(",");
    router.push(`/${locale}/leaderboard?page=1&characters=${characters}`);
  }

  if (error) return <div>Failed to load, please try again later.</div>;

  return (
    <div>
      <div className="card">
        <Filters characters={characters} onApplyFilters={handleApplyFilters} />
      </div>
      {!data ? (
        <div className="my-8 flex items-center justify-center text-2xl text-gray-400">
          <FaSpinner className="mr-2 animate-spin" />
          <span>Loading...</span>
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
              Previous
            </button>
            {/* <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span> */}
            <button
              className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
              onClick={() => changePage(Number(page) + 1)}
              disabled={data.length < 20}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
