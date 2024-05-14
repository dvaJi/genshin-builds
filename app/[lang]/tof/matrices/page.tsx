import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import MatrixPortrait from "@components/tof/MatrixPortrait";
import { i18n } from "@i18n-config";
import type { Matrices } from "@interfaces/tof/matrices";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";
import { getRarityColor } from "@utils/rarity";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const title = "Matrices";
  const description = "List of matrices in Tower of Fantasy.";
  return genPageMetadata({
    title,
    description,
    path: `/tof/matrices`,
    locale: params.lang,
  });
}

export default async function TOFMatricesPage({ params }: Props) {
  const data = await getRemoteData<Matrices[]>("tof", "matrices");

  const ssr = data.filter((m) => m.rarity === 5);
  const sr = data.filter((m) => m.rarity === 4);
  const r = data.filter((m) => m.rarity === 3);
  const n = data.filter((m) => m.rarity === 2);

  return (
    <div className="mt-6">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("SSR")}>SSR</span>{" "}
          <span className="text-tof-200">Matrices</span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-vulcan-700 bg-vulcan-800 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-7">
          {ssr.map((matrix) => (
            <Link
              key={matrix.id}
              href={`/${params.lang}/tof/matrices/${slugify2(matrix.name)}`}
              prefetch={false}
            >
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
          <span className="text-tof-200">Matrices</span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-vulcan-700 bg-vulcan-800 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {sr.map((matrix) => (
            <Link
              key={matrix.id}
              href={`/${params.lang}/tof/matrices/${slugify2(matrix.name)}`}
              prefetch={false}
            >
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("R")}>R</span>{" "}
          <span className="text-tof-200">Matrices</span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-vulcan-700 bg-vulcan-800 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {r.map((matrix) => (
            <Link
              key={matrix.id}
              href={`/${params.lang}/tof/matrices/${slugify2(matrix.name)}`}
              prefetch={false}
            >
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-3xl">
          <span className={getRarityColor("N")}>N</span>{" "}
          <span className="text-tof-200">Matrices</span>
        </h2>
        <div className="grid grid-cols-2 gap-1 rounded border border-vulcan-700 bg-vulcan-800 px-4 py-4 shadow-lg md:grid-cols-4 lg:grid-cols-5">
          {n.map((matrix) => (
            <Link
              key={matrix.id}
              href={`/${params.lang}/tof/matrices/${slugify2(matrix.name)}`}
              prefetch={false}
            >
              <MatrixPortrait matrix={matrix} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
