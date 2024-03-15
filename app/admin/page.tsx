import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

import Button from "@components/admin/Button";
import { authOptions } from "@lib/auth";

export default async function Admin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="m-8 flex items-start justify-start gap-4">
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="m-8 flex items-start justify-start gap-4">
      <Link
        href={`/admin/invalidator`}
        className="rounded border border-zinc-600 bg-zinc-800 px-12 py-6 transition-colors hover:border-zinc-400"
      >
        Invalidate
      </Link>
    </div>
  );
}
