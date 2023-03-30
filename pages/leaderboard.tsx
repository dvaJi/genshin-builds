import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";
import { type PaginationState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";

import useIntl from "@hooks/use-intl";
import { Build, Profile } from "interfaces/profile";
import { GetStaticProps } from "next";
import { getLocale } from "@lib/localData";

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
    `/api/leaderboard?lang=${localeGI}&limit=${pagination.pageSize}`,
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

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <div>
      <div className="py-4 text-center">
        <Link
          href="/profile"
          className="text-lg font-semibold hover:text-white"
        >
          Submit your UUID here!
        </Link>
      </div>
      <div className="text-center text-sm">
        This section is still in development. If you have any suggestions or
        feedback, please fill out the form!
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
