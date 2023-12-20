import type { Artifact } from "genshin-data";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Image from "next/image";

import { genPageMetadata } from "@app/seo";
import Badge from "@components/ui/Badge";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({
    lang,
  }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "artifacts"
  );
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
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "artifacts"
  );

  const artifacts = await getGenshinData<Artifact[]>({
    resource: "artifacts",
    language: langData,
  });

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "artifacts", defaultMessage: "Artifacts" })}
      </h2>
      <div className="card grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {artifacts.map((artifact) => (
          <div
            key={artifact._id}
            className="m-2 rounded-lg border border-vulcan-600 bg-vulcan-700 px-4 py-2"
          >
            <div className="flex">
              <div>
                <Image
                  src={getUrl(`/artifacts/${artifact.id}.png`, 96, 96)}
                  alt={artifact.name}
                  width={94}
                  height={94}
                />
              </div>
              <div>
                <h4 className="text-lg text-slate-50">{artifact.name}</h4>
                <p className="text-sm">
                  {t({ id: "max_rarity", defaultMessage: "Max Rarity" })}:{" "}
                  {artifact.max_rarity}
                </p>
                <div className="flex">
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
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs">
              {artifact.one_pc && (
                <p className="py-2" title={artifact.one_pc}>
                  <Badge textSize="xxs">1</Badge> {artifact.one_pc}
                </p>
              )}
              {artifact.two_pc && (
                <p className="py-2" title={artifact.two_pc}>
                  <Badge textSize="xxs">2</Badge>
                  {artifact.two_pc}
                </p>
              )}
              {artifact.four_pc && (
                <p className="py-2" title={artifact.four_pc}>
                  <Badge textSize="xxs">4</Badge>
                  {artifact.four_pc}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
