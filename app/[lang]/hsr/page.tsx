import HSRData from "hsr-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

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
  const { t, locale } = await useTranslations(params.lang, "hsr", "characters");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail All Characters List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "A complete list of all playable characters in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr`,
    locale,
  });
}

export default async function Page({ params }: Props) {
  const { t, language } = await useTranslations(
    params.lang,
    "hsr",
    "characters"
  );

  const hsrData = new HSRData({
    language: language as any,
  });
  const characters = await hsrData.characters({
    select: ["id", "name", "rarity", "combat_type", "path"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-hsr-100 text-2xl">
          {t({ id: "characters", defaultMessage: "Characters" })}
        </h2>
        <p>
          {t({
            id: "characters_description",
            defaultMessage:
              "Characters are obtainable units in Honkai: Star Rail.",
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
