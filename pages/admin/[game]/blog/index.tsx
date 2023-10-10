import { BlogPost } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useMemo, useState } from "react";
import useSWR from "swr";

import Button from "@components/admin/Button";
import { getLocale } from "@lib/localData";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { languages } from "@utils/locale-to-lang";

type Props = {
  currentPage: number;
  game: string;
  locale: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const columnHelper = createColumnHelper<BlogPost>();

const BlogAdmin = ({ game }: Props) => {
  const [language, setLanguage] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const { data, error, isLoading } = useSWR<{ data: BlogPost[] }>(
    `/api/blog/list?game=${game}${
      language === "all" ? "" : "&lang=" + language
    }&limit=${pagination.pageSize}&page=${pagination.pageIndex}`,
    fetcher
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("language", {
        cell: (info) =>
          languages.find((lang) => lang.code === info.getValue())?.name,
      }),
      columnHelper.accessor("createdAt", {
        cell: (info) => info.renderValue(),
        sortDescFirst: true,
      }),
      columnHelper.accessor("updatedAt", {
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor((row) => row.id, {
        id: "actions",
        cell: (info) => (
          <div className="flex gap-2 text-sm">
            <Link href={`/admin/${game}/blog/edit?id=${info.getValue()}`}>
              <Button>Edit</Button>
            </Link>
            <Button onClick={() => onDelete(info.getValue())}>Delete</Button>
          </div>
        ),
      }),
    ],
    [game]
  );

  const onDelete = (id: string) => {
    if (typeof window !== "undefined") {
      if (confirm("Are you sure you want to delete this blog post?")) {
        fetch(`/api/blog?id=${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }).then(() => {
          window.location.reload();
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col border-b border-zinc-800 bg-zinc-900 px-4 py-4 text-white">
        <div className="flex justify-between">
          <select
            className="rounded-md border border-zinc-700 bg-zinc-900 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="all">All</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <Link href={`/admin/${game}/blog/create`}>
            <Button>Create Post</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col p-4">
        {error && <div style={{ color: "red" }}>{error}</div>}
        {isLoading && <div>Loading...</div>}
        <Table data={data?.data || []} columns={columns} />
      </div>
      <div className="my-4 flex justify-center gap-4">
        <Button
          state="secondary"
          disabled={pagination.pageIndex === 0}
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex - 1,
              pageSize: pagination.pageSize,
            })
          }
        >
          Previous
        </Button>
        <Button
          state="secondary"
          disabled={(data?.data?.length ?? 0) < pagination.pageSize}
          onClick={() =>
            setPagination({
              pageIndex: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
            })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

function Table({ data, columns }: any) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-zinc-800">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="py-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b border-zinc-800">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  locale = "en",
  ...ctx
}) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const page = query?.page ? parseInt(query.page as string) : 1;
  const lngDict = await getLocale(locale, params?.game as string);

  return {
    props: {
      currentPage: page,
      game: params?.game,
      locale,
      lngDict,
    },
  };
};

export default BlogAdmin;
