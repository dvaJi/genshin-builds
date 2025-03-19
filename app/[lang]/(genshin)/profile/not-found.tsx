import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@app/components/ui/button";
import { Card, CardContent } from "@app/components/ui/card";
import { Link } from "@i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Genshin.profile");
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
            {t("profile_not_found")}
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            {t("profile_not_found_desc")}
          </p>
          <Link href="/profile/">
            <Button variant="default" size="lg">
              {t("submit_uid")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
