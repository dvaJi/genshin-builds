import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

import PostsTable from "./posts-table";
import Toolbar from "./toolbar";

import Button from "@components/admin/Button";
import { authOptions } from "@lib/auth";
import { getPosts } from "@lib/blog";

type Props = {
  searchParams: Record<string, string>;
};

export default async function BlogAdmin({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const lang = searchParams.lang;
  const game = searchParams.game;
  const showDrafts = searchParams.showDrafts;
  const page = parseInt(searchParams.page ?? "1");
  const limit = parseInt(searchParams.limit ?? "10") || 10;

  const options = {
    page,
    limit,
    showDrafts: showDrafts === "true",
  };

  const data = await getPosts(game, lang, options);

  return (
    <div className="w-full">
      <div className="flex w-full flex-col border-b border-zinc-800 bg-zinc-900 px-8 py-4 text-white">
        <Toolbar />
      </div>
      <div className="m-8 flex flex-col rounded">
        <PostsTable data={(data?.data as any) || []} />
      </div>
      <div className="my-4 flex justify-center gap-4">
        <Link
          href={{
            pathname: "/admin/blog",
            query: {
              ...searchParams,
              page: (page - 1).toString(),
            },
          }}
        >
          <Button state="secondary" disabled={page === 1}>
            Previous
          </Button>
        </Link>
        <Link
          href={{
            pathname: "/admin/blog",
            query: {
              ...searchParams,
              page: (page + 1).toString(),
            },
          }}
        >
          <Button state="secondary" disabled={(data?.data.length ?? 0) < limit}>
            Next
          </Button>
        </Link>
      </div>
    </div>
  );
}
