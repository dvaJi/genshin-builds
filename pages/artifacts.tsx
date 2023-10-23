import GenshinData, { Artifact } from "genshin-data";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Metadata from "@components/Metadata";
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export const config = {
  runtime: "experimental-edge",
};

type Props = {
  artifacts: Artifact[];
};

const ArtifactsPage = ({ artifacts }: Props) => {
  const { t } = useIntl("artifacts");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Artifacts Artifacts List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "All the best artifact gear sets, locations, and stats.",
        })}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "artifacts", defaultMessage: "Artifacts" })}
      </h2>
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {artifacts.map((artifact) => (
            <div
              key={artifact._id}
              className="m-2 rounded-lg border border-vulcan-600 bg-vulcan-700 px-4 py-2"
            >
              <div className="flex">
                <div>
                  <LazyLoadImage
                    src={getUrl(`/artifacts/${artifact.id}.png`, 96, 96)}
                    alt={artifact.name}
                    loading="lazy"
                    width={94}
                    height={94}
                    placeholderSrc={getUrlLQ(
                      `/artifacts/${artifact.id}.png`,
                      10,
                      10
                    )}
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
                      <LazyLoadImage
                        src={getUrl(
                          `/artifacts/${artifact.circlet.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.circlet.name}
                        title={artifact.circlet.name}
                        placeholderSrc={getUrlLQ(
                          `/artifacts/${artifact.circlet.id}.png`,
                          4,
                          4
                        )}
                      />
                    )}
                    {artifact.flower && (
                      <LazyLoadImage
                        src={getUrl(
                          `/artifacts/${artifact.flower.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.flower.name}
                        title={artifact.flower.name}
                        placeholderSrc={getUrlLQ(
                          `/artifacts/${artifact.flower.id}.png`,
                          4,
                          4
                        )}
                      />
                    )}
                    {artifact.goblet && (
                      <LazyLoadImage
                        src={getUrl(
                          `/artifacts/${artifact.goblet.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.goblet.name}
                        title={artifact.goblet.name}
                        placeholderSrc={getUrlLQ(
                          `/artifacts/${artifact.goblet.id}.png`,
                          4,
                          4
                        )}
                      />
                    )}
                    {artifact.plume && (
                      <LazyLoadImage
                        src={getUrl(
                          `/artifacts/${artifact.plume.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.plume.name}
                        title={artifact.plume.name}
                        placeholderSrc={getUrlLQ(
                          `/artifacts/${artifact.plume.id}.png`,
                          4,
                          4
                        )}
                      />
                    )}
                    {artifact.sands && (
                      <LazyLoadImage
                        src={getUrl(
                          `/artifacts/${artifact.sands.id}.png`,
                          54,
                          54
                        )}
                        width={45}
                        height={45}
                        alt={artifact.sands.name}
                        title={artifact.sands.name}
                        placeholderSrc={getUrlLQ(
                          `/artifacts/${artifact.sands.id}.png`,
                          4,
                          4
                        )}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs">
                {artifact.one_pc && (
                  <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap py-2"
                    title={artifact.one_pc}
                  >
                    <Badge>1</Badge> {artifact.one_pc}
                  </p>
                )}
                {artifact.two_pc && (
                  <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap py-2"
                    title={artifact.two_pc}
                  >
                    <Badge>2</Badge>
                    {artifact.two_pc}
                  </p>
                )}
                {artifact.four_pc && (
                  <p
                    className="overflow-hidden text-ellipsis whitespace-nowrap py-2"
                    title={artifact.four_pc}
                  >
                    <Badge>4</Badge>
                    {artifact.four_pc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale = "en",
}) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const artifacts = await genshinData.artifacts();

  return {
    props: { artifacts: artifacts, lngDict },
  };
};

export default ArtifactsPage;
