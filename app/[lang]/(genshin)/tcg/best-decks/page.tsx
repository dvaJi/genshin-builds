import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import CopyToClipboard from "@components/CopyToClipboard";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { TCGCard } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { encodeDeckCode } from "@utils/gcg-share-code";

export const dynamic = "force-static";
export const revalidate = 86400;

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
  const { t, locale } = await getTranslations(lang, "genshin", "tcg_decks");
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
    path: `/tcg/best-decks`,
    locale,
  });
}

export default async function GenshinBestDecks({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "tcg_decks");

  const _bestDecks = await getGenshinData<
    Record<
      string,
      {
        c: string[];
        a: string[];
      }
    >
  >({
    resource: "tcgBestDecks",
    language: langData,
    filter: {
      id: "best-decks",
    },
  });
  const bestDecks = Object.values(_bestDecks).filter(
    (a: any) => a !== "best-decks"
  );

  const cCharacters = await getGenshinData<Record<string, TCGCard>>({
    resource: "tcgCharacters",
    language: langData,
    asMap: true,
    select: ["id", "name", "shareId"],
  });
  const cActions = await getGenshinData<Record<string, TCGCard>>({
    resource: "tcgActions",
    language: langData,
    asMap: true,
    select: ["id", "name", "shareId"],
  });

  const decks = bestDecks.map((deck) => ({
    characters: deck.c.map((c: string) => cCharacters[c]),
    actions: deck.a.map((a: string) => ({
      ...cActions[a.split("|")[0]],
      count: Number(a.split("|")[1]),
    })),
  }));

  const cards = [...Object.values(cActions), ...Object.values(cCharacters)];

  const CARD_ORDER = cards
    .filter((card) => card.shareId !== 0)
    .sort((a, b) => a.shareId - b.shareId)
    .map((card) => card.id);

  const ENCODE_ID_BY_CARD: Record<string, number> = Object.fromEntries(
    CARD_ORDER.map((card, index) => [card, index + 1])
  ) as Record<string, number>;

  const generateCode = (deck: {
    characters: TCGCard[];
    actions: { id: string; count: number }[];
  }) =>
    encodeDeckCode(
      deck.characters.map((c) => c.id),
      deck.actions.map((a) => [a.id, a.count]),
      ENCODE_ID_BY_CARD
    );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-3xl font-semibold tracking-tight text-card-foreground">
        {t({ id: "best_decks", defaultMessage: "Best Decks" })}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {decks.map((deck, i) => (
          <>
            <div
              className="group/card relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-lg"
              key={deck.characters[0].id + i}
            >
              <div className="flex justify-between">
                <Link
                  href={`/${lang}/tcg/deck-builder?code=${encodeURIComponent(generateCode(deck))}`}
                  className="mb-4 text-xl font-semibold text-card-foreground transition-colors hover:text-primary"
                  prefetch={false}
                >
                  {deck.characters.map((card) => card.name).join(" / ")}
                </Link>
                <CopyToClipboard
                  content={generateCode(deck)}
                  className="opacity-0 transition-all group-hover/card:opacity-100 data-[copied=true]:ring-2 data-[copied=true]:ring-green-600/50"
                  copiedText="Copied!"
                >
                  Share Code
                </CopyToClipboard>
              </div>
              <div className="relative flex flex-wrap content-center justify-center gap-2">
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 opacity-0 backdrop-blur-sm transition-all group-hover/card:opacity-100">
                  <Link
                    href={`/${lang}/tcg/deck-builder?code=${encodeURIComponent(generateCode(deck))}`}
                    className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    prefetch={false}
                  >
                    View Deck
                  </Link>
                </div>
                {deck.characters.map((card) => (
                  <div key={card.id} className="relative">
                    <Image
                      src={getUrl(`/tcg/${card.id}.png`, 190, 330)}
                      alt={card.name}
                      title={card.name}
                      width={180}
                      height={320}
                      className="rounded-xl border-2 border-transparent transition-all group-hover/card:border-primary md:w-36"
                    />
                    <div className="mt-2 text-center text-sm font-medium text-muted-foreground transition-colors group-hover/card:text-card-foreground">
                      {card.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {(i + 1) % 6 === 0 ? (
              <div className="col-span-2">
                <FrstAds
                  placementName="genshinbuilds_incontent_1"
                  classList={["flex", "justify-center"]}
                />
              </div>
            ) : null}
          </>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
