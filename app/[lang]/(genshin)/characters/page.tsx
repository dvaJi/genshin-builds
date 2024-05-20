import { i18n } from "i18n-config";
import type { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getData } from "@lib/localData";

import GenshinCharactersList from "./list";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "characters"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Characters List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/characters`,
    locale,
  });
}

export default async function GenshinCharacters({ params }: Props) {
  const { t, locale, langData } = await useTranslations(
    params.lang,
    "genshin",
    "characters"
  );

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "rarity", "name", "element", "release"],
  });

  const elements = characters.reduce((acc, character) => {
    if (!acc.includes(character.element)) {
      acc.push(character.element);
    }
    return acc;
  }, [] as string[]);

  const beta = await getData<Beta>("genshin", "beta");

  const allCharacters = [
    ...beta[locale].characters.map((c: any) => {
      // only include this columns: ["id", "name", "element", "rarity"]
      const { id, name, element, rarity } = c;
      return { id, name, element, rarity, beta: true, release: 0 };
    }),
    ...characters,
  ].sort((a, b) => b.release - a.release) as (Character & { beta?: boolean })[];

  const latestRelease = allCharacters[0].release;

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <GenshinCharactersList
        characters={allCharacters}
        elements={elements}
        latestRelease={latestRelease}
      />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
