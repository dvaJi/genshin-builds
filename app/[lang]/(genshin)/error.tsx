"use client";

import Image from "next/image";
import { useEffect } from "react";

import { invalidateAction } from "@app/admin/invalidator/actions";
import Button from "@components/ui/Button";
import { Link } from "@i18n/navigation";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card relative z-20 overflow-hidden">
      <Image
        className="absolute -top-4 left-0 z-10 opacity-20 grayscale md:opacity-40 lg:opacity-50"
        src="/imgs/stickers/sticker_5.webp"
        width={250}
        height={400}
        alt="Paimon (?)"
      />
      <div className="relative z-20 text-center">
        <h2 className="mb-6 text-3xl text-zinc-200">
          Something went wrong! {":("}
        </h2>
        <p className="text-lg">
          We&apos;re sorry, but an error has occurred. Please try again later.
          If the problem persists,{" "}
          <Link
            href="/contact"
            className="text-slate-300 underline hover:text-slate-50"
          >
            contact our support team
          </Link>{" "}
          for further assistance.
          <br />
          <br />
          <br />
          <Button
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
          </Button>
        </p>
      </div>
    </div>
  );
}
