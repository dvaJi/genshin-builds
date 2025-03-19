"use client";

import { memo } from "react";
import { MdClose } from "react-icons/md";

import Input from "@components/ui/Input";
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
      <Input
        placeholder={messages.searchPlaceholder}
        value={ad.search}
        onChange={(e) => $filters.set({ ...ad, search: e.target.value })}
      />
      <button
        className="absolute right-2 top-2 p-1 text-muted hover:text-white"
        onClick={() => $filters.set({ ...ad, search: "" })}
        title={messages.clearSearch}
      >
        <MdClose />
      </button>
    </div>
  );
}

export default memo(Search);
