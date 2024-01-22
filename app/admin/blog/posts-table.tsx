"use client";

import Button from "@components/admin/Button";
import Badge from "@components/ui/Badge";
import { i18n } from "@i18n-config";
import type { BlogContent, BlogPost } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useMemo } from "react";
import EditPost from "./edit-post";

type Post = BlogPost & { contents: BlogContent[] };

const columnHelper = createColumnHelper<Post>();

type Props = {
  data: Post[];
};

export default function PostsTable({ data }: Props) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("slug", {
        cell: (info) => (
          <div
            className={clsx("cursor-pointer")}
            onClick={info.row.getToggleExpandedHandler()}
          >
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
      // columnHelper.accessor("language", {
      //   cell: (info) =>
      //     languages.find((lang) => lang.code === info.getValue())?.name,
      // }),
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
            {/* <Link href={`/admin/blog/edit/${info.getValue()}`}>
              <Button state="secondary">Edit</Button>
            </Link> */}
            <EditPost post={info.row.original} />
            <Button
              state="error_ghost"
              onClick={() => onDelete(info.getValue())}
            >
              Delete
            </Button>
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

  return <Table data={data} columns={columns} />;
}

function Table({ data, columns }: any) {
  const table = useReactTable<Post>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
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
          <Fragment key={row.id}>
            <tr className={row.getIsExpanded() ? "bg-zinc-700/20" : ""}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 text-zinc-300">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {row.getIsExpanded() && (
              <Fragment>
                {renderSubComponent({ row })}
                <div className={clsx("m-2")}>
                  Missing TL:
                  <div className="inline text-xs">
                    {i18n.locales
                      .filter(
                        (lang) =>
                          !row.original.contents.find(
                            (content) => content.language === lang
                          )
                      )
                      .map((lang) => (
                        <Link
                          href={`/admin/blog/create?postid=${row.original.id}&game=${row.original.game}&lang=${lang}`}
                          className="mx-1 inline rounded bg-zinc-700 p-1 hover:bg-zinc-600"
                          key={lang}
                        >
                          {lang}
                        </Link>
                      ))}
                  </div>
                </div>
                <tr className="h-px w-full bg-zinc-800 pb-2">
                  <td colSpan={row.getVisibleCells().length}></td>
                </tr>
              </Fragment>
            )}
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}

const renderSubComponent = ({ row }: { row: Row<Post> }) => {
  return row.original.contents.map((content, i) => (
    <tr
      key={content.id}
      className={clsx("rounded bg-zinc-700/20 hover:bg-zinc-700/70", {
        "bg-zinc-700/20": row.getIsExpanded(),
      })}
    >
      <td
        className={clsx("p-2", {
          "rounded-tl": i === 0,
          "rounded-bl": i === row.original.contents.length - 1,
        })}
      >
        {!content.published ? <Badge>Draft</Badge> : null}
        <Badge className="opacity-50">{content.language}</Badge>
        {content.title}
      </td>
      <td></td>
      <td>{content.createdAt.toISOString()}</td>
      <td>{content.updatedAt.toISOString()}</td>
      <td
        className={clsx("p-2", {
          "rounded-tr": i === 0,
          "rounded-br": i === row.original.contents.length - 1,
        })}
      >
        <div className="flex gap-2 text-sm">
          {/* {!info.row.getValue("published") ? (
            <Button state="success">Publish</Button>
          ) : null} */}
          <Link href={`/admin/blog/edit/${content.id}`}>
            <Button state="secondary">Edit</Button>
          </Link>
          {/* <Button state="error_ghost" onClick={() => onDelete(info.getValue())}>
          Delete
        </Button> */}
          <Link
            href={`/${content.language}/${row.original.game}/blog/${row.original.slug}`}
          >
            <Button>View</Button>
          </Link>
        </div>
      </td>
    </tr>
  ));
};
