import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Badge } from "@app/components/ui/badge";
import { Card, CardContent } from "@app/components/ui/card";
import { genPageMetadata } from "@app/seo";
import Image from "@components/genshin/Image";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type { Artifact } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.artifacts",
  });
  const langData = getLangData(lang, "genshin");

  const artifact = await getGenshinData<Artifact>({
    resource: "artifacts",
    language: langData,
    filter: { id },
  });

  if (!artifact) return;

  const title = t("artifact_details", {
    name: artifact.name,
    rarity: artifact.max_rarity,
  });

  const description = t("artifact_description", { name: artifact.name });

  return genPageMetadata({
    title,
    description,
    path: `/artifacts/${id}`,
    locale: lang,
  });
}

export default async function ArtifactDetail({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.artifacts");
  const langData = getLangData(lang, "genshin");

  const artifact = await getGenshinData<Artifact>({
    resource: "artifacts",
    language: langData,
    filter: { id },
  });

  if (!artifact) notFound();

  const pieces = [
    artifact.flower,
    artifact.plume,
    artifact.sands,
    artifact.goblet,
    artifact.circlet,
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4">
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <Image
                src={`/artifacts/${artifact.id}.png`}
                alt={artifact.name}
                width={160}
                height={160}
                className="aspect-square rounded-lg"
                priority
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">{artifact.name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {t("max_rarity")}: {artifact.max_rarity}★
                </p>
              </div>

              <div className="space-y-3">
                {artifact.one_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {t("one_pc")}
                    </Badge>
                    <p className="text-muted-foreground">{artifact.one_pc}</p>
                  </div>
                )}
                {artifact.two_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {t("two_pc")}
                    </Badge>
                    <p className="text-muted-foreground">{artifact.two_pc}</p>
                  </div>
                )}
                {artifact.four_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {t("four_pc")}
                    </Badge>
                    <p className="text-muted-foreground">{artifact.four_pc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-2xl font-semibold">{t("artifact_pieces")}</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pieces.map((piece) => (
          <Card key={piece!.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Image
                  src={`/artifacts/${piece!.id}.png`}
                  alt={piece!.name}
                  width={80}
                  height={80}
                  className="aspect-square rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{piece!.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {piece!.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center", "mt-8"]}
      />
    </div>
  );
}
