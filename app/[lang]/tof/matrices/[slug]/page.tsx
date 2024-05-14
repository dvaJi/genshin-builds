import clsx from "clsx";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/tof/Image";
import type { Matrices } from "@interfaces/tof/matrices";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";
import { getRarityColor, rarityToString } from "@utils/rarity";
import { i18n } from "@i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Matrices[]>("tof", "matrices");

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: slugify2(c.name),
      }))
    );
  }

  return routes;
}

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const data = await getRemoteData<Matrices[]>("tof", "matrices");

  const matrix = data.find((m) => slugify2(m.name) === params.slug);

  if (!matrix) {
    return;
  }

  const title = `${matrix.name} - Matrix`;
  const description = `All the information about the ${matrix.name} matrix in Tower of Fantasy.`;

  return genPageMetadata({
    title,
    description,
    path: `/tof/matrices/${params.slug}`,
    locale: params.lang,
  });
}

export default async function MatrixPage({ params }: Props) {
  const data = await getRemoteData<Matrices[]>("tof", "matrices");

  const matrix = data.find((m) => slugify2(m.name) === params.slug);

  if (!matrix) {
    return notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="z-10 flex items-center">
          <Image
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={`/matrices/iconLarge_${matrix.id}.png`}
            alt={matrix.name}
            width={192}
            height={192}
          />
          <div className="">
            <h2 className="text-tof-50 mb-4 text-4xl font-bold lg:text-6xl">
              {matrix.name}
            </h2>
            <span
              className={clsx(
                "text-xl font-bold lg:text-3xl",
                getRarityColor(matrix.rarity)
              )}
            >
              {rarityToString(matrix.rarity)}
            </span>
            <span className="ml-2 text-xl uppercase lg:text-3xl">Matrix</span>
          </div>
        </div>
        <div className="flex w-full justify-end"></div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
        {matrix.sets.map((bonus) => (
          <div key={bonus.need} className="flex flex-col">
            <div className="text-tof-50 text-2xl font-bold">
              {bonus.need} Pieces
            </div>
            <span dangerouslySetInnerHTML={{ __html: bonus.description }} />
          </div>
        ))}
      </div>
    </div>
  );
}
