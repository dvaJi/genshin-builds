import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { TCGCard } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";

import CardsTable from "./table";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "tcg_cards");
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
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "tcg_cards");

  const cards = await getGenshinData<TCGCard[]>({
    resource: "tcgCards",
    language: langData,
    select: ["name", "id", "attributes"],
  });

  const types = cards
    .map((card) => card?.attributes?.card_type)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t({
              id: "cards",
              defaultMessage: "Genius Invokation TCG Card List",
            })}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            {t({
              id: "description",
              defaultMessage:
                "Browse the complete collection of cards available in Genius Invokation TCG. Filter by type, search by name, and create your own custom decks.",
            })}
          </p>
        </div>
        <Ads className="hidden md:block" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-8">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
      </div>

      <div className="card">
        <CardsTable lang={lang} cards={cards} types={types} />
      </div>

      <div className="mt-8">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
