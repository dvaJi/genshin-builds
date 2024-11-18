import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";

import CharactersList from "./characters";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "hsr", "characters");
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
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "hsr", "characters");

  const characters = await getHSRData<Character[]>({
    resource: "characters",
    language: langData,
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
