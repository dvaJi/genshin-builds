import type { Character } from "@interfaces/hsr";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import CharactersList from "./characters";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

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
  const { t, langData } = await useTranslations(
    params.lang,
    "hsr",
    "characters"
  );

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
