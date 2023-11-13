"use client";

import { BlogPost } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import useSWR from "swr";

import Button from "@components/admin/Button";
import Badge from "@components/ui/Badge";
import { GAME } from "@utils/games";
import { languages } from "@utils/locale-to-lang";
import { useSession } from "next-auth/react";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const columnHelper = createColumnHelper<BlogPost>();

const BlogAdmin = () => {
  const { status } = useSession();
  const [game, setGame] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const params = new URLSearchParams(
    JSON.parse(
      JSON.stringify({
        limit: pagination.pageSize.toString(),
        page: pagination.pageIndex.toString(),
        sort: "desc",
        showDrafts: "true",
        language: language === "all" ? undefined : language,
        game: game === "all" ? undefined : game,
      })
    )
  );
  const { data, error, isLoading } = useSWR<{ data: BlogPost[] }>(
    `/api/blog/list?${params.toString()}`,
    fetcher
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        cell: (info) => (
          <div>
            {!info.row.original.published ? (
              <Badge className="opacity-80" textSize="xxs">
                Draft
              </Badge>
            ) : null}
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor("game", {
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
            {/* {!info.row.getValue("published") ? (
              <Button state="success">Publish</Button>
            ) : null} */}
            <Link href={`/admin/blog/edit/${info.getValue()}`}>
              <Button state="secondary">Edit</Button>
            </Link>
            <Button
              state="error_ghost"
              onClick={() => onDelete(info.getValue())}
            >
              Delete
            </Button>
            <Link
              href={`/${info.row.original.game}/blog/${info.row.original.slug}`}
            >
              <Button>View</Button>
            </Link>
          </div>
        ),
      }),
    ],
    []
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

  if (status === "unauthenticated") {
    return notFound();
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex w-full flex-col border-b border-zinc-800 bg-zinc-900 px-8 py-4 text-white">
        <div className="flex justify-between">
          <div className="flex gap-4">
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
            <select
              className="rounded-md border border-zinc-700 bg-zinc-900 text-sm"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              <option value="all">All</option>
              {Object.entries(GAME).map(([key, game]) => (
                <option key={key} value={key}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>

          {/* <Link href={`/admin/blog/create`}>
            <Button>Create Post</Button>
          </Link> */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button>Create Post</Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="data-[side=top]:animate-slideDownAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade min-w-[220px] rounded-md border border-zinc-700 bg-zinc-900 p-[5px] will-change-[opacity,transform] data-[side=right]:animate-slideLeftAndFade"
                sideOffset={5}
                align="center"
              >
                {Object.values(GAME).map((game) => (
                  <DropdownMenu.Item
                    key={game.slug}
                    className="group relative flex h-7 select-none items-center rounded px-[5px] pl-[25px] text-[13px] leading-none text-zinc-200 outline-none data-[highlighted]:bg-white data-[highlighted]:text-black"
                    onSelect={() => {
                      window.location.href = `/admin/blog/create?game=${game.slug}`;
                    }}
                  >
                    {game.name}{" "}
                    <Image
                      className="ml-auto block rounded"
                      src={`/imgs/games/${game.slug}.webp`}
                      alt={game.name}
                      width={20}
                      height={20}
                    />
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      <div className="m-8 flex flex-col rounded">
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Table data={data?.data || []} columns={columns} />
        {isLoading && (
          <div className="w-full text-center text-xl my-4">Loading...</div>
        )}
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
    <table className="table border-separate border-spacing-0 border-0">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="">
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="border-y border-zinc-700 bg-zinc-800 px-2 py-2 text-left text-xs font-normal capitalize text-zinc-400 first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r"
              >
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
          <tr key={row.id} className="">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border-b border-zinc-700/80 p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BlogAdmin;
