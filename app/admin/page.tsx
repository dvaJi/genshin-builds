"use client";

import { signIn, useSession } from "next-auth/react";

import Button from "@components/admin/Button";
import Link from "next/link";

export default function Page() {
  const { status } = useSession();

  if (status === "unauthenticated" || status === "loading") {
    return (
      <div className="m-8 flex items-start justify-start gap-4">
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="m-8 flex items-start justify-start gap-4">
      <Link
        href={`/admin/blog`}
        className="rounded border border-zinc-600 bg-zinc-800 px-12 py-6 transition-colors hover:border-zinc-400"
      >
        Blog
      </Link>
    </div>
  );
}
