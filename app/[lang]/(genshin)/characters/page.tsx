import type { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { routing } from "@i18n/routing";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";

import GenshinCharactersList from "./list";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.characters",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/characters`,
    locale: lang,
  });
}

export default async function GenshinCharacters({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.characters");
  const langData = getLangData(lang, "genshin");

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "rarity", "name", "element", "release", "weapon_type"],
  });

  const elements = characters.reduce((acc, character) => {
    if (!acc.includes(character.element.id)) {
      acc.push(character.element.id);
    }
    return acc;
  }, [] as string[]);
  const weaponsTypes = characters.reduce((acc, character) => {
    if (!acc.includes(character.weapon_type.id)) {
      acc.push(character.weapon_type.id);
    }
    return acc;
  }, [] as string[]);

  const beta = await getData<Beta>("genshin", "beta");

  const allCharacters = [
    ...(beta[lang]?.characters ?? []).map((c: any) => {
      // only include this columns: ["id", "name", "element", "rarity"]
      const { id, name, element, rarity } = c;
      return { id, name, element, rarity, beta: true, release: 0 };
    }),
    ...characters,
  ].sort((a, b) => b.release - a.release) as (Character & { beta?: boolean })[];

  const latestRelease = allCharacters[0].release;

  return (
    <div className="min-h-screen px-2 sm:px-0">
      <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:mb-8 sm:gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("characters")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-lg">
            {t("description")}
          </p>
        </div>
        <Ads className="hidden md:block" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-4 sm:mb-8">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
      </div>

      <div className="card overflow-hidden">
        <GenshinCharactersList
          characters={allCharacters}
          elements={elements}
          weaponsTypes={weaponsTypes}
          latestRelease={latestRelease}
        />
      </div>

      <div className="mt-4 sm:mt-8">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
