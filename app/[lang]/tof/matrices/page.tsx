import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import TOFData, { type Languages } from "tof-builds";

import { genPageMetadata } from "@app/seo";
import MatrixPortrait from "@components/tof/MatrixPortrait";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRarityColor } from "@utils/rarity";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "tof", "matrices");
  const title = t({
    id: "title",
    defaultMessage: "ToF Impact Matrices List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All Matrices ranked in order of power, viability, and versatility to clear content.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/tof/matrices`,
    locale,
  });
}

export default async function TOFMatricesPage({ params }: Props) {
  const { t, language } = await useTranslations(params.lang, "tof", "matrices");
  const tofData = new TOFData({
    language: language as Languages,
  });
  const matrices = (
    await tofData.matrices({
      select: ["id", "name", "suitName", "rarity", "hash"],
    })
  ).map((matrix) => ({ ...matrix, suitName: matrix.suitName ?? "" }));

  const ssr = matrices.filter((m) => m.rarity === "SSR");
  const sr = matrices.filter((m) => m.rarity === "SR");
  const r = matrices.filter((m) => m.rarity === "R");
  const n = matrices.filter((m) => m.rarity === "N");

  return (
    <div className="mt-6">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("SSR")}>SSR</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-7">
          {ssr.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("SR")}>SR</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {sr.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("R")}>R</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {r.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("N")}>N</span>{" "}
          <span className="text-tof-200">
            {t({ id: "matrices", defaultMessage: "Matrices" })}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-tof-700 bg-tof-900 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {n.map((matrix) => (
            <Link key={matrix.id} href={`/tof/matrices/${matrix.id}`}>
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
