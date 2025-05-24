import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

import { genPageMetadata } from "@app/seo";
import CopyToClipboard from "@components/CopyToClipboard";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { TCGCard } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { encodeDeckCode } from "@utils/gcg-share-code";

export const dynamic = "force-static";
export const revalidate = 86400;
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
    namespace: "Genshin.tcg_decks",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/tcg/best-decks`,
    locale: lang,
  });
}

export default async function GenshinBestDecks({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.tcg_decks");
  const langData = getLangData(lang, "genshin");

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
    (a: any) => a !== "best-decks",
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
    CARD_ORDER.map((card, index) => [card, index + 1]),
  ) as Record<string, number>;

  const generateCode = (deck: {
    characters: TCGCard[];
    actions: { id: string; count: number }[];
  }) =>
    encodeDeckCode(
      deck.characters.map((c) => c.id),
      deck.actions.map((a) => [a.id, a.count]),
      ENCODE_ID_BY_CARD,
    );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-3xl font-semibold tracking-tight text-card-foreground">
        {t("best_decks")}
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
                  href={`/tcg/deck-builder?code=${encodeURIComponent(generateCode(deck))}`}
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
                  {t("share_code")}
                </CopyToClipboard>
              </div>
              <div className="relative flex flex-wrap content-center justify-center gap-2">
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80 opacity-0 backdrop-blur-sm transition-all group-hover/card:opacity-100">
                  <Link
                    href={`/tcg/deck-builder?code=${encodeURIComponent(generateCode(deck))}`}
                    className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    prefetch={false}
                  >
                    {t("view_deck")}
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
