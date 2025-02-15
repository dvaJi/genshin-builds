import { i18n } from "i18n-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

import WWCharactersList from "./characters/list";

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
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "home",
  );

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves`,
    locale: langData,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "home",
  );
  const characters = await getWWData<Characters[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity"],
  });

  if (!characters) {
    return notFound();
  }

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      {/* <CharactersList characters={characters} /> */}
      <div className="card overflow-hidden">
        <WWCharactersList characters={characters} />
      </div>
    </div>
  );
}
