import Image from "next/image";
import Link from "next/link";

import Button from "@components/ui/Button";

export default function NotFound() {
  return (
    <>
      <div className="card relative z-20 overflow-hidden">
        <Image
          className="absolute -top-4 left-0 z-10 opacity-40 grayscale"
          src="/imgs/stickers/sticker_10.png"
          width={250}
          height={400}
          alt="Paimon (?)"
        />
        <div className="text-center">
          <h2 className="mb-6 text-3xl text-zinc-200">Profile not found!</h2>
          <p className="text-lg">
            This profile currently does not exist. If you want to create it,
            please submit your UID.
            <br />
            <Link href="/profile/" prefetch={false}>
              <Button className="mt-6">Submit UID</Button>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
