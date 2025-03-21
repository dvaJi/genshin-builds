"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { invalidateAction } from "@app/admin/invalidator/actions";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative z-20 overflow-hidden rounded-lg border-2 border-neutral-600 bg-neutral-800 p-6">
      <Image
        className="absolute -top-4 left-0 z-10 opacity-20 grayscale md:opacity-40 lg:opacity-50"
        src="/imgs/stickers/Sticker_Set_1_Nicole_smash.webp"
        width={250}
        height={400}
        alt="Nicole"
      />
      <div className="relative z-20 text-center">
        <h2 className="mb-6 text-3xl text-neutral-50">
          Something went wrong! {":("}
        </h2>
        <p className="text-lg">
          We&apos;re sorry, but an error has occurred. Please try again later.
          If the problem persists,{" "}
          <Link
            href="/contact"
            className="text-yellow-500 underline hover:text-yellow-300"
            prefetch={false}
          >
            contact our support team
          </Link>{" "}
          for further assistance.
          <br />
          <br />
          <br />
          <button
            className="rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4"
            onClick={
              // Attempt to recover by trying to re-render the segment
              async () => {
                const formData = new FormData();
                formData.append("type", "path");
                formData.append("value", window.location.pathname);
                await invalidateAction({}, formData);
                reset();
              }
            }
          >
            Retry
          </button>
        </p>
      </div>
    </div>
  );
}
