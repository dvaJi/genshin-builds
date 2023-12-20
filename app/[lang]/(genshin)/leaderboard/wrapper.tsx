"use client";

import type { Character } from "@interfaces/genshin";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import useSWR from "swr";

import Select from "@components/Select";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { Build, Profile } from "interfaces/profile";

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
  const lastId = searchParams.get("lastId") || "";
  const [filters, setFilters] = useState<Filters>({ characters: [] });
  const [characterFilter, setCharacterFilter] = useState<string[]>([]);
  const { localeGI } = useIntl("leaderboard");
  const { data, error } = useSWR<(Build & { player: Profile })[]>(
    `/api/genshin/leaderboard?lang=${localeGI}&characters=${filters.characters.join(
      ","
    )}&lastID=${lastId}`,
    fetcher
  );

  const updateCharactersFilter = (optionId: string) => {
    /// Check if the option is already selected
    const index = characterFilter.indexOf(optionId);
    if (index === -1) {
      setCharacterFilter((prev) => [...prev, optionId]);
    }

    /// Remove the option from the filter
    if (index !== -1) {
      setCharacterFilter((prev) => prev.filter((id) => id !== optionId));
    }
  };

  function nextPage() {
    if (data && data.length > 0) {
      router.push(`/${locale}/leaderboard?lastId=${data[data.length - 1]._id}`);
    }
  }

  function previousPage() {
    router.back();
  }

  function handleApplyFilters() {
    setFilters({
      characters: characterFilter.map((id) => {
        const ch = characters.find((c) => c.id === id);
        return ch?._id.toString() ?? "";
      }),
    });
    router.push(`/${locale}/leaderboard?lastId=`);
  }

  if (error) return <div>Failed to load, please try again later.</div>;

  return (
    <div>
      <div className="card">
        <div className="flex gap-4">
          <Select
            clearOnSelect
            placeholder="Select characters"
            options={characters.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
            onChange={(option) => {
              updateCharactersFilter(option.id);
            }}
            itemsListRender={(option) => (
              <>
                <img
                  className="mr-3 h-6 w-6"
                  src={getUrl(
                    `/characters/${option.id}/${option.id}_portrait.png`,
                    32,
                    32
                  )}
                  alt={option.name}
                />
                <span className="flex-1 text-base">{option.name}</span>
              </>
            )}
          />
          <div className="flex flex-wrap gap-2">
            {characterFilter.map((id) => {
              const ch = characters.find((c) => c.id === id);
              return (
                <button
                  key={id}
                  title="Remove filter"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-vulcan-700 p-1 px-2 hover:bg-vulcan-600"
                  onClick={() => {
                    updateCharactersFilter(id);
                  }}
                >
                  <img
                    className="h-6 w-6 rounded-full"
                    src={getUrl(
                      `/characters/${ch?.id}/${ch?.id}_portrait.png`,
                      32,
                      32
                    )}
                    alt={ch?.name}
                  />
                  <span className="text-sm">{ch?.name}</span>
                  <span className="text-slate-400 group-hover:text-slate-300">
                    x
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4">
          <Button
            disabled={filters.characters.length === 0}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
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
              onClick={previousPage}
              disabled={lastId === ""}
            >
              Previous
            </button>
            {/* <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span> */}
            <button
              className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
              onClick={nextPage}
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
