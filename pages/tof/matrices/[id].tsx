import clsx from "clsx";
import { MdMemory } from "react-icons/md";
import { FaPrayingHands } from "react-icons/fa";
import { GetStaticProps, GetStaticPaths } from "next";
import { GiNestedHearts, GiOvermind } from "react-icons/gi";
import TOFData, { Languages, Matrix, languages } from "@dvaji/tof-builds";

import Metadata from "@components/Metadata";

import { getDefaultLocale, getLocale } from "@lib/localData";
import { TOF_IMGS_CDN } from "@lib/constants";
import { getRarityColor } from "@utils/rarity";
import useIntl, { IntlFormatProps } from "@hooks/use-intl";

interface CharacterPageProps {
  matrix: Matrix;
  locale: string;
}

const CharacterPage = ({ matrix, locale }: CharacterPageProps) => {
  const { t } = useIntl("matrix");
  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} ToF Impact Matrix Build Guide",
          values: { name: matrix.name },
        })}
        pageDescription={matrix.bonus.join(", ")}
        jsonLD={generateJsonLd(locale, matrix, t)}
      />
      <div className="flex items-center justify-between">
        <div className="z-10 flex items-center">
          <img
            className="h-48 w-48"
            src={`${TOF_IMGS_CDN}/matrices/icon_matrix_${matrix.hash}_256.png`}
            alt={matrix.name}
          />
          <div className="">
            <h2 className="mb-4 text-6xl font-extrabold text-tof-50">
              {matrix.name}
            </h2>
            <span
              className={clsx(
                "text-3xl font-bold",
                getRarityColor(matrix.rarity)
              )}
            >
              {matrix.rarity}
            </span>
            <span className="ml-2 text-3xl uppercase">
              {t({ id: "matrix", defaultMessage: "Matrix" })}
            </span>
          </div>
        </div>
        <div>
          <img
            className="h-44 w-full lg:h-48"
            src={`${TOF_IMGS_CDN}/matrices/avatar_matrix_${matrix.hash}_256.png`}
            alt={matrix.name}
          />
        </div>
      </div>
      <div className="rounded border border-vulcan-700 bg-vulcan-700/90 py-4 px-4 shadow-lg">
        {matrix.bonus.map((bonus) => (
          <div key={bonus.value} className="flex flex-col">
            {bonus.count === 2 && (
              <div className="text-2xl font-bold text-tof-50">
                {t({ id: "2pcbonus", defaultMessage: "2-piece Set Bonus" })}
              </div>
            )}
            {bonus.count === 3 && (
              <div className="text-2xl font-bold text-tof-50">
                {t({ id: "3pcbonus", defaultMessage: "3-piece Set Bonus" })}
              </div>
            )}
            {bonus.count === 4 && (
              <div className="text-2xl font-bold text-tof-50">
                {t({ id: "4pcbonus", defaultMessage: "4-piece Set Bonus" })}
              </div>
            )}
            <span>{bonus.value}</span>
          </div>
        ))}
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-tof-50">
            {t({ id: "sets", defaultMessage: "Sets" })}:
          </h3>
          <div className="mb-2 flex items-center">
            <GiOvermind className="mr-2 text-4xl text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.mind.name}</h4>
              <p>{matrix.mind.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <MdMemory className="mr-2 text-4xl text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.memory.name}</h4>
              <p>{matrix.memory.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <FaPrayingHands className="mr-2 text-4xl text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.belief.name}</h4>
              <p>{matrix.belief.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <GiNestedHearts className="mr-2 text-4xl text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.emotion.name}</h4>
              <p>{matrix.emotion.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateJsonLd = (
  locale: string,
  matrix: Matrix,
  t: (props: IntlFormatProps) => string
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/",
          "name": "TOF-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/matrices",
          "name": "${t({
            id: "matrices",
            defaultMessage: "Matrices",
          })}"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/matrices/${
    matrix.id
  }",
          "name": "${matrix.name}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const defaultLocale = getDefaultLocale(
    locale,
    languages as unknown as string[]
  );
  const lngDict = await getLocale(defaultLocale, "tof");
  const tofData = new TOFData({
    language: defaultLocale as Languages,
  });
  const matrix = await tofData.matrixbyId(params?.id as string);

  return {
    props: {
      matrix,
      lngDict,
      locale: defaultLocale,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const tofData = new TOFData({ language: "en" });
  const matrices = await tofData.matrices();

  const paths: { params: { id: string }; locale: string }[] = [];

  for (const locale of locales) {
    matrices.forEach((matrices) => {
      paths.push({ params: { id: matrices.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
