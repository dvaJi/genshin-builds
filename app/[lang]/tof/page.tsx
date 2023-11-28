import type { Metadata } from "next";
import dynamic from "next/dynamic";
import TOFData, { type Languages } from "tof-builds";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import CharactersList from "./characters";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "tof", "characters");
  const title = t({
    id: "title",
    defaultMessage: "ToF-Builds.com Wiki Database",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
  });
  return genPageMetadata({
    title,
    description,
    path: `/tof`,
    locale,
  });
}

export default async function TOFPage({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "tof",
    "characters"
  );

  const tofData = new TOFData({
    language: langData as Languages,
  });
  const characters = await tofData.characters({
    select: [
      "id",
      "name",
      "rarity",
      "element",
      "resonance",
      "weapon_id",
      "weapon",
    ],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-tof-100">
          {t({ id: "main_title", defaultMessage: "Characters and Weapons" })}
        </h2>
        <p>
          {t({
            id: "sub_title",
            defaultMessage:
              "Discover character builds, comprehensive guides, and a wiki database all in one place.",
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <CharactersList characters={characters} />
    </div>
  );
}
