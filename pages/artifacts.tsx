import { GetStaticProps } from "next";
import GenshinData, { Artifact } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import StarRarity from "@components/StarRarity";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

type Props = {
  artifacts: Artifact[];
  artifacts1set: Artifact[];
};

const ArtifactsPage = ({ artifacts, artifacts1set }: Props) => {
  const { t } = useIntl("artifacts");

  return (
    <div>
      <Metadata
        fn={t}
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
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "artifacts", defaultMessage: "Artifacts" })}
      </h2>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <h2 className="py-2 text-2xl font-semibold text-gray-200">
          {t({
            id: "2-4piece_artifact_sets",
            defaultMessage: "2-4 Piece Artifact Sets",
          })}
        </h2>
        <div>
          <table className="w-full">
            <thead>
              <tr>
                <th></th>
                <th>{t({ id: "name", defaultMessage: "Name" })}</th>
                <th>{t({ id: "max_rarity", defaultMessage: "Max Rarity" })}</th>
                <th>
                  {t({ id: "2piece_bonus", defaultMessage: "2-Piece Bonus" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"
                  }
                >
                  <td>
                    <LazyLoadImage
                      height={54}
                      width={54}
                      src={getUrl(`/artifacts/${row.id}.png`, 54, 54)}
                      alt={row.id}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>
                    <StarRarity rarity={row.max_rarity} />
                  </td>
                  <td>{row["two_pc"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h2 className="py-2 text-2xl font-semibold text-gray-200">
            {t({
              id: "1piece_artifact_sets",
              defaultMessage: "1-Piece Artifact Sets",
            })}
          </h2>
          <table className="w-full">
            <thead>
              <tr>
                <th></th>
                <th>{t({ id: "name", defaultMessage: "Name" })}</th>
                <th>{t({ id: "max_rarity", defaultMessage: "Max Rarity" })}</th>
                <th>
                  {t({ id: "1piece_bonus", defaultMessage: "1-Piece Bonus" })}
                </th>
              </tr>
            </thead>
            <tbody>
              {artifacts1set.map((row, index) => (
                <tr
                  key={row.id}
                  className={
                    index % 2 === 0 ? "bg-vulcan-600" : "bg-vulcan-700"
                  }
                >
                  <td>
                    <LazyLoadImage
                      height={54}
                      width={54}
                      src={getUrl(`/artifacts/${row.id}.png`, 54, 54)}
                      alt={row.id}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>
                    <StarRarity rarity={row.max_rarity} />
                  </td>
                  <td>{row["one_pc"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const artifacts = await genshinData.artifacts();
  const artifacts1set = artifacts.filter((a) => a["one_pc"]);
  const artifacts4set = artifacts.filter((a) => !a["one_pc"]);

  return {
    props: { artifacts: artifacts4set, artifacts1set: artifacts1set, lngDict },
  };
};

export default ArtifactsPage;
