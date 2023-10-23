import { type PaginationState } from "@tanstack/react-table";
import GenshinData, { Character } from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import useSWR from "swr";

import Select from "@components/Select";
import Button from "@components/ui/Button";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { Build, Profile } from "interfaces/profile";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });
const ProfileFavorites = dynamic(
  () => import("@components/genshin/ProfileFavorites"),
  { ssr: false }
);

const LeaderBoardBuildsTable = dynamic(
  () => import("@components/genshin/LeaderBoardBuildsTable"),
  { ssr: false }
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

function LeaderBoardPage({ characters }: Props) {
  const lastIdRef = useRef<string | null>(null);
  const filters = useRef<Filters>({ characters: [] });
  const [characterFilter, setCharacterFilter] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { localeGI } = useIntl("leaderboard");
  const { data, error } = useSWR<(Build & { player: Profile })[]>(
    `/api/leaderboard?lang=${localeGI}&limit=${
      pagination.pageIndex
    }&characters=${filters.current.characters.join(",")}&page=${
      pagination.pageIndex
    }`,
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

  function handleApplyFilters() {
    filters.current.characters = characterFilter.map((id) => {
      const ch = characters.find((c) => c.id === id);
      return ch?._id.toString() ?? "";
    });
    lastIdRef.current = null;
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageIndex: 0, // reset page index to force re-render
    }));
  }

  if (error) return <div>Failed to load, please try again later.</div>;

  return (
    <div>
      <ProfileFavorites />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="py-4 text-center">
        <Link
          href="/profile"
          className="text-lg font-semibold hover:text-white"
        >
          Submit your UID here!
        </Link>
      </div>
      <div className="text-center text-sm">
        This section is still in development.
      </div>
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
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
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
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: pagination.pageIndex - 1,
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              {"<"}
            </button>
            <span className="mx-2 text-lg">{pagination.pageIndex + 1}</span>
            <button
              className="rounded border border-vulcan-600 p-1 transition-colors hover:border-vulcan-500 hover:bg-vulcan-500 disabled:opacity-50"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: pagination.pageIndex + 1,
                }))
              }
              disabled={data.length < pagination.pageSize}
            >
              {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["_id", "id", "name"],
  });
  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      characters,
      lngDict,
    },
  };
};

export default LeaderBoardPage;
