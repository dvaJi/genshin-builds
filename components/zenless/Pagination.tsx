import Link from "next/link";
import React, { useMemo } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

  if (totalItems <= itemsPerPage) {
    return null;
  }

  return (
    <div className="container mx-auto flex items-center justify-center">
      <div className="flex items-center justify-center rounded-full bg-zinc-950">
        <Link
          href={renderPageLink(currentPage - 1)}
          className="ml-1 rounded-l-full bg-white py-1 pl-2 pr-4 text-xl font-semibold text-black transition-transform hover:scale-110"
          style={{
            clipPath: "polygon(100% 0, 100% 10%, 70% 100%, 0 100%, 0 0)",
          }}
          prefetch={false}
        >
          <FaArrowLeft />
        </Link>
        {pages.map((pageNumber, i) =>
          pageNumber === dotts ? (
            <span
              key={i}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
            >
              {pageNumber}
            </span>
          ) : (
            <Link
              key={i}
              href={renderPageLink(pageNumber as number)}
              className={`${
                pageNumber === currentPage
                  ? "bg-white text-black"
                  : "text-white"
              } mx-1 px-4 py-1 text-sm font-semibold no-underline hover:bg-white hover:text-black`}
              style={{
                clipPath: "polygon(30% 0%, 100% 0%, 70% 100%, 0% 100%)",
              }}
              prefetch={false}
            >
              {pageNumber}
            </Link>
          ),
        )}
        <Link
          href={renderPageLink(currentPage + 1)}
          className="mr-1 rounded-r-full bg-white py-1 pl-4 pr-2 text-xl font-semibold text-black transition-transform hover:scale-110"
          style={{
            clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 0 90%, 30% 0)",
          }}
          prefetch={false}
        >
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
