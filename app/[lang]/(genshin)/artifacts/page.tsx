import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@app/components/ui/card";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import Badge from "@components/ui/Badge";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Artifact } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({
    lang,
  }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "artifacts");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Artifacts Artifacts List",
  });
  const description = t({
    id: "description",
    defaultMessage: "All the best artifact gear sets, locations, and stats.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/artifacts`,
    locale,
  });
}

export default async function GenshinCharacters({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "artifacts");

  const artifacts = await getGenshinData<Artifact[]>({
    resource: "artifacts",
    language: langData,
  });

  return (
    <div className="container mx-auto px-4">
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {t({ id: "artifacts", defaultMessage: "Artifacts" })}
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {artifacts.map((artifact) => (
          <Card key={artifact._id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Link href={`/${lang}/artifacts/${artifact.id}`}>
                    <Image
                      src={getUrl(`/artifacts/${artifact.id}.png`, 96, 96)}
                      alt={artifact.name}
                      width={94}
                      height={94}
                      className="rounded-md transition-opacity hover:opacity-80"
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/${lang}/artifacts/${artifact.id}`}
                    className="transition-colors hover:text-primary"
                  >
                    <h4 className="text-lg font-semibold">{artifact.name}</h4>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {t({ id: "max_rarity", defaultMessage: "Max Rarity" })}:{" "}
                    {artifact.max_rarity}
                  </p>
                  <div className="flex gap-1">
                    {artifact.circlet && (
                      <Image
                        src={getUrl(
                          `/artifacts/${artifact.circlet.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.circlet.name}
                        title={artifact.circlet.name}
                        loading="lazy"
                        className="rounded-sm"
                      />
                    )}
                    {artifact.flower && (
                      <Image
                        src={getUrl(
                          `/artifacts/${artifact.flower.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.flower.name}
                        title={artifact.flower.name}
                        loading="lazy"
                        className="rounded-sm"
                      />
                    )}
                    {artifact.goblet && (
                      <Image
                        src={getUrl(
                          `/artifacts/${artifact.goblet.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.goblet.name}
                        title={artifact.goblet.name}
                        loading="lazy"
                        className="rounded-sm"
                      />
                    )}
                    {artifact.plume && (
                      <Image
                        src={getUrl(
                          `/artifacts/${artifact.plume.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.plume.name}
                        title={artifact.plume.name}
                        loading="lazy"
                        className="rounded-sm"
                      />
                    )}
                    {artifact.sands && (
                      <Image
                        src={getUrl(
                          `/artifacts/${artifact.sands.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.sands.name}
                        title={artifact.sands.name}
                        loading="lazy"
                        className="rounded-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {artifact.one_pc && (
                  <div
                    className="flex items-start gap-2.5"
                    title={artifact.one_pc}
                  >
                    <Badge variant="outline" className="shrink-0">
                      1
                    </Badge>
                    <span className="text-sm leading-tight text-muted-foreground">
                      {artifact.one_pc}
                    </span>
                  </div>
                )}
                {artifact.two_pc && (
                  <div
                    className="flex items-start gap-2.5"
                    title={artifact.two_pc}
                  >
                    <Badge variant="outline" className="shrink-0">
                      2
                    </Badge>
                    <span className="text-sm leading-tight text-muted-foreground">
                      {artifact.two_pc}
                    </span>
                  </div>
                )}
                {artifact.four_pc && (
                  <div
                    className="flex items-start gap-2.5"
                    title={artifact.four_pc}
                  >
                    <Badge variant="outline" className="shrink-0">
                      4
                    </Badge>
                    <span className="text-sm leading-tight text-muted-foreground">
                      {artifact.four_pc}
                    </span>
                  </div>
                )}
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
