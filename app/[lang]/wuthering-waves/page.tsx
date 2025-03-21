import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

import WWCharactersList from "./characters/list";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "edge";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "WW.home",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("WW.home");
  const langData = getLangData(lang, "wuthering-waves");
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
