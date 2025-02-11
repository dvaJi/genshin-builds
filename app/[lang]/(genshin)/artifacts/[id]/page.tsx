import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@app/components/ui/badge";
import { Card, CardContent } from "@app/components/ui/card";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Artifact } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";

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
  const { t, langData, locale } = await getTranslations(
    lang,
    "genshin",
    "artifacts"
  );

  const artifact = await getGenshinData<Artifact>({
    resource: "artifacts",
    language: langData,
    filter: { id },
  });

  if (!artifact) return;

  const title = `${artifact.name} - ${t({
    id: "artifact_details",
    defaultMessage: "Artifact Details",
  })}`;

  const description = t(
    {
      id: "artifact_description",
      defaultMessage: "Details and bonuses for the {name} artifact set.",
    },
    { name: artifact.name }
  );

  return genPageMetadata({
    title,
    description,
    path: `/artifacts/${id}`,
    locale,
  });
}

export default async function ArtifactDetail({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "artifacts");

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
                src={getUrl(`/artifacts/${artifact.id}.png`, 160, 160)}
                alt={artifact.name}
                width={160}
                height={160}
                className="rounded-lg"
                priority
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold">{artifact.name}</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {t({ id: "max_rarity", defaultMessage: "Max Rarity" })}:{" "}
                  {artifact.max_rarity}★
                </p>
              </div>

              <div className="space-y-3">
                {artifact.one_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      1pc
                    </Badge>
                    <p className="text-muted-foreground">{artifact.one_pc}</p>
                  </div>
                )}
                {artifact.two_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      2pc
                    </Badge>
                    <p className="text-muted-foreground">{artifact.two_pc}</p>
                  </div>
                )}
                {artifact.four_pc && (
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      4pc
                    </Badge>
                    <p className="text-muted-foreground">{artifact.four_pc}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-2xl font-semibold">
        {t({ id: "artifact_pieces", defaultMessage: "Artifact Pieces" })}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pieces.map((piece) => (
          <Card key={piece!.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Image
                  src={getUrl(`/artifacts/${piece!.id}.png`, 96, 96)}
                  alt={piece!.name}
                  width={96}
                  height={96}
                  className="rounded-md"
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
