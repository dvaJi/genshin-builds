import clsx from "clsx";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { FaPrayingHands } from "react-icons/fa";
import { GiNestedHearts, GiOvermind } from "react-icons/gi";
import { MdMemory } from "react-icons/md";
import TOFData, { type Languages } from "tof-builds";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getTofUrl } from "@lib/imgUrl";
import { getRarityColor } from "@utils/rarity";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, language, locale } = await useTranslations(
    params.lang,
    "tof",
    "matrix"
  );
  const tofData = new TOFData({
    language: language as Languages,
  });
  const matrix = await tofData.matrixbyId(params.slug);

  if (!matrix) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "{name} ToF Impact Matrix Build Guide",
    values: { name: matrix.name },
  });
  // Remove html tags
  const description = matrix.bonus
    .map((bonus) => bonus.value.replace(/(<([^>]+)>)/gi, ""))
    .join(", ");

  return genPageMetadata({
    title,
    description,
    path: `/tof/character/${params.slug}`,
    locale,
  });
}

export default async function MatrixPage({ params }: Props) {
  const { t, language } = await useTranslations(params.lang, "tof", "matrix");
  const tofData = new TOFData({
    language: language as Languages,
  });
  const matrix = await tofData.matrixbyId(params.slug);

  if (!matrix) {
    return notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="z-10 flex items-center">
          <img
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={getTofUrl(`/matrices/icon_matrix_${matrix.hash}_256.png`)}
            alt={matrix.name}
          />
          <div className="">
            <h2 className="mb-4 text-4xl font-bold text-tof-50 lg:text-6xl">
              {matrix.name}
            </h2>
            <span
              className={clsx(
                "text-xl font-bold lg:text-3xl",
                getRarityColor(matrix.rarity)
              )}
            >
              {matrix.rarity}
            </span>
            <span className="ml-2 text-xl uppercase lg:text-3xl">
              {t({ id: "matrix", defaultMessage: "Matrix" })}
            </span>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <img
            className="h-36 md:h-40 lg:h-48"
            src={getTofUrl(`/matrices/avatar_matrix_${matrix.hash}_256.png`)}
            alt={matrix.name}
          />
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
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
            <span dangerouslySetInnerHTML={{ __html: bonus.value }} />
          </div>
        ))}
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-tof-50">
            {t({ id: "sets", defaultMessage: "Sets" })}:
          </h3>
          <div className="mb-2 flex items-center">
            <GiOvermind className="mr-4 h-8 w-8 flex-shrink-0 text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.mind.name}</h4>
              <p>{matrix.mind.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <MdMemory className="mr-4 h-8 w-8 flex-shrink-0 text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.memory.name}</h4>
              <p>{matrix.memory.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <FaPrayingHands className="mr-4 h-8 w-8 flex-shrink-0 text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.belief.name}</h4>
              <p>{matrix.belief.desc}</p>
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <GiNestedHearts className="mr-4 h-8 w-8 flex-shrink-0 text-tof-300" />
            <div>
              <h4 className="text-xl text-tof-200">{matrix.emotion.name}</h4>
              <p>{matrix.emotion.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
