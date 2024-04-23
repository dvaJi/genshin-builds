"use client";

import { MdClose } from "react-icons/md";

import { useStore } from "@nanostores/react";

import { $filters } from "./state";

type Props = {
  messages: {
    searchPlaceholder: string;
    clearSearch: string;
  };
};

function Search({ messages }: Props) {
  const ad = useStore($filters);
  return (
    <div className="relative">
      <input
        placeholder={messages.searchPlaceholder}
        value={ad.search}
        className="w-full rounded-md p-2 text-slate-200"
        onChange={(e) => $filters.set({ ...ad, search: e.target.value })}
      />
      <button
        className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-200"
        onClick={() => $filters.set({ ...ad, search: "" })}
        title={messages.clearSearch}
      >
        <MdClose />
      </button>
    </div>
  );
}

export default Search;
