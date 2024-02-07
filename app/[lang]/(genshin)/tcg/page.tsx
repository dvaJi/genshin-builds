import type { TCGCard } from "@interfaces/genshin";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { i18n } from "i18n-config";
import CardsTable from "./table";

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
    "tcg_cards"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genius Invokation TCG Card Game",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Genius Invokation TCG is a new card game feature in Genshin Impact. Guide includes what is the Genius Invocation TCG, character card game, how to get cards!",
  });

  return genPageMetadata({
    title,
    description,
    path: `/tcg`,
    locale,
  });
}

export default async function GenshinTCG({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_cards"
  );

  const cards = await getGenshinData<TCGCard[]>({
    resource: "tcgCards",
    language: langData,
    select: ["name", "id", "attributes"],
  });

  const types = cards
    .map((card) => card?.attributes?.card_type)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cards", defaultMessage: "Genius Invokation TCG Card List" })}
      </h2>
      <CardsTable lang={params.lang} cards={cards} types={types} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
