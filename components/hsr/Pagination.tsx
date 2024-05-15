import Link from "next/link";
import React, { useMemo } from "react";

export type PaginationProps = {
  totalItems: number;
  currentPage: number;
  renderPageLink: (page: number) => string;
  itemsPerPage?: number;
};

export const dotts = "...";

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage = 10,
  renderPageLink,
}: PaginationProps) => {
  const pages = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getPages = (length: number, inc: number = 1) =>
      Array.from({ length }, (_, i) => i + inc);

    // -> 1 2 3 4 5
    if (totalPages <= 5) {
      return getPages(totalPages);
    }
    // -> 1 2 3 4 ... 10
    if (currentPage <= 3) {
      return [1, 2, 3, 4, dotts, totalPages];
    }
    // -> 1 ... 4 5 6 ... 10
    if (currentPage < totalPages - 2) {
      return [
        1,
        dotts,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        dotts,
        totalPages,
      ];
    }
    // -> 1 ... 7 8 9 10
    return [1, dotts, ...getPages(4, totalPages - 3)];
  }, [totalItems, itemsPerPage, currentPage]);

  return (
    <div className="my-8 flex items-center justify-center ">
      {pages.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span
            key={i}
            className="rounded-full px-4 py-2 text-sm font-semibold text-slate-400"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={i}
            href={renderPageLink(pageNumber as number)}
            className={`${
              pageNumber === currentPage ? "text-white" : "text-slate-400"
            } mx-1 rounded-full px-4 py-2 text-sm font-semibold no-underline hover:bg-vulcan-700`}
            prefetch={false}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
};

export default Pagination;
