"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div>
      <h2>Page not found</h2>
      <Link href="/hsr">
        <button>Go Home</button>
      </Link>
    </div>
  );
}
