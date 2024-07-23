"use client";

import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <div className="relative z-20 overflow-hidden p-6">
      <Image
        className="absolute -top-4 left-0 z-10 opacity-20 grayscale md:opacity-40 lg:opacity-50"
        src="/imgs/stickers/Sticker_Set_1_Nicole_smash.webp"
        width={250}
        height={400}
        alt="Nicole"
      />
      <div className="relative z-20 text-center">
        <h2 className="mb-6 text-3xl">Not Found</h2>
        <p className="text-lg">
          We&apos;re sorry, but the page you are looking for does not exist.
          <br />
          <br />
          <br />
          <Link
            href="/zenless"
            className="text-slate-800 underline hover:text-slate-950"
          >
            <button className="rounded-2xl border-2 border-black px-4 py-2 font-semibold ring-black transition-all hover:bg-white hover:ring-4">
              Go Home
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}
