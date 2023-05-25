import { type PaginationState } from "@tanstack/react-table";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import useSWR from "swr";

import ProfileFavorites from "@components/genshin/ProfileFavorites";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { Build, Profile } from "interfaces/profile";

const LeaderBoardBuildsTable = dynamic(
  () => import("@components/genshin/LeaderBoardBuildsTable"),
  { ssr: false }
);

function LeaderBoardPage() {
  const lastIdRef = useRef<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { localeGI } = useIntl("leaderboard");
  const { data, error } = useSWR<(Build & { player: Profile })[]>(
    `/api/leaderboard?lang=${localeGI}&limit=${pagination.pageIndex}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.length > 0) {
      lastIdRef.current = data[data.length - 1]._id;
    }
  }, [data]);

  async function fetcher(url: string) {
    const query =
      lastIdRef.current && pagination.pageIndex !== 0
        ? `&lastID=${lastIdRef.current}`
        : "";
    const res = await fetch(url + query);
    return await res.json();
  }

  if (error) return <div>Failed to load, please try again later.</div>;
  if (!data)
    return (
      <div className="my-8 flex items-center justify-center text-2xl text-gray-400">
        <FaSpinner className="mr-2 animate-spin" />
        <span>Loading...</span>
      </div>
    );

  return (
    <div>
      <ProfileFavorites />
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
      <LeaderBoardBuildsTable
        data={data}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      lngDict,
    },
  };
};

export default LeaderBoardPage;
