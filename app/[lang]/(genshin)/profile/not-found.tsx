import Image from "next/image";
import Link from "next/link";

import { Button } from "@app/components/ui/button";
import { Card, CardContent } from "@app/components/ui/card";

export default function NotFound() {
  return (
    <Card className="relative mx-auto max-w-md overflow-hidden">
      <CardContent className="p-6">
        <Image
          className="absolute -top-4 left-0 z-0 opacity-40 grayscale"
          src="/imgs/stickers/sticker_10.png"
          width={250}
          height={400}
          alt="Paimon (?)"
        />
        <div className="relative z-10 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Profile not found!
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            This profile currently does not exist. If you want to create it,
            please submit your UID.
          </p>
          <Link href="/profile/" prefetch={false}>
            <Button variant="default" size="lg">
              Submit UID
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
