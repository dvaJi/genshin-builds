"use client";

import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <div className="relative z-20 overflow-hidden p-6">
      <Image
        className="absolute -top-4 left-0 z-10 opacity-20 grayscale md:opacity-40 lg:opacity-50"
        src="/imgs/stickers/Icon_Emoji_Cry_Animated.webp"
        width={250}
        height={400}
        alt="Nicole"
        unoptimized
      />
      <div className="relative z-20 text-center">
        <h2 className="mb-6 text-3xl">Page not found</h2>
        <p className="text-lg">
          We&apos;re sorry, but the page you are looking for does not exist.
          <br />
          <br />
          <br />
          <Link href="/hsr">
            <button className="rounded-2xl border-2 border-black px-4 py-2 font-semibold ring-black transition-all hover:bg-white hover:ring-4">
              Go Home
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}
