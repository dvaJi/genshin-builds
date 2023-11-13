"use client";

import { useSession } from "next-auth/react";

import { Session } from "@lib/session";
import UserAvatar from "./UserAvatar";

export default function Sidebar() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated" || status === "loading") {
    return null;
  }

  return (
    <>
      <div className="mx-auto mt-4 flex flex-grow flex-col space-y-4 text-zinc-400">
        <button className="flex h-10 w-12 items-center justify-center rounded-md text-zinc-500">
          <svg
            viewBox="0 0 24 24"
            className="h-5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            <line x1="12" y1="11" x2="12" y2="17"></line>
            <line x1="9" y1="14" x2="15" y2="14"></line>
          </svg>
        </button>
      </div>
      <div className="mb-2 flex items-center justify-center">
        <UserAvatar session={session as Session} />
      </div>
    </>
  );
}
