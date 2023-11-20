import type { Metadata } from "next";
import dynamic from "next/dynamic";
import TOFData, { languages, type Languages } from "tof-builds";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getDefaultLocale } from "@lib/localData";
import CharactersList from "./characters";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export async function generateMetadata(): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations("tof", "characters");
  const title = t({
    id: "title",
    defaultMessage: "ToF-Builds.com Wiki Database",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale,
      type: "website",
      url: `https://genshin-builds.com/tof`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const { t, locale } = await useTranslations("tof", "characters");

  const tofLanguage = getDefaultLocale<Languages>(
    locale,
    languages as unknown as string[]
  );
  const tofData = new TOFData({
    language: tofLanguage,
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
