import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";

import { genPageMetadata } from "@app/seo";
import Alert from "@components/Alert";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type {
  TCGActionCard,
  TCGCard,
  TCGCharacterCard,
} from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { decodeDeckCode } from "@utils/gcg-share-code";

import BuildDeckStateProvider from "../deck-state-provider";
import Analytics from "./analytics";
import Cards from "./cards";
import DrawSimulator from "./draw-simulator";
import MyDeck from "./my-deck";
import Share from "./share";

export const dynamic = "force-dynamic";
export const runtime = "edge";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.tcg_deck_builder",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/tcg/deck-builder`,
    locale: lang,
    noOpenGraph: true,
  });
}

export default async function GenshinTCG({ params, searchParams }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.tcg_deck_builder");
  const langData = getLangData(lang, "genshin");

  const acards = await getGenshinData<TCGActionCard[]>({
    resource: "tcgActions",
    language: langData,
    select: ["_id", "name", "id", "shareId", "attributes"],
  });
  const ccards = await getGenshinData<TCGCharacterCard[]>({
    resource: "tcgCharacters",
    language: langData,
    select: ["_id", "name", "id", "shareId", "attributes"],
  });

  const cards = [...acards, ...ccards];

  const cardsMapById = Object.fromEntries(
    cards.map((card) => [card.id, card]),
  ) as Record<string, TCGCard>;

  const CARD_ORDER = cards
    .filter((card) => card.shareId !== 0)
    .sort((a, b) => a.shareId - b.shareId)
    .map((card) => card.id);

  const CARD_BY_ENCODE_ID: Record<number, string> = Object.fromEntries(
    CARD_ORDER.map((card, index) => [index + 1, card]),
  );

  const ENCODE_ID_BY_CARD: Record<string, number> = Object.fromEntries(
    CARD_ORDER.map((card, index) => [card, index + 1]),
  ) as Record<string, number>;

  const { code } = await searchParams;
  const decodedDeck = code
    ? decodeDeckCode(decodeURIComponent(code), CARD_BY_ENCODE_ID)
    : {
        characterCards: ["undefined", "undefined", "undefined"],
        actionCards: { ["undefined"]: 30 },
      };

  return (
    <div className="relative">
      <BuildDeckStateProvider initialDeck={{ ...decodedDeck, code }}>
        {code && decodedDeck.characterCards[0] === "undefined" ? (
          <div className="absolute left-0 right-0 top-0 flex items-center justify-center">
            <Alert
              className="flex rounded-lg bg-destructive/90 px-6 py-2 text-center text-destructive-foreground"
              closeClassName="text-destructive-foreground/90 font-semibold hover:text-destructive-foreground"
              autoCloseDelay={2000}
            >
              {t("error_invalid_deck_code")}
            </Alert>
          </div>
        ) : null}
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
                {t("title")}
              </h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-card-foreground">
                  {t("my_deck")}
                </h2>
                <div className="mt-2">
                  <MyDeck cardsMapById={cardsMapById} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-card-foreground">
                  {t("cards")}
                </h2>
                <div className="mt-2">
                  <Cards actions={acards} characters={ccards} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b p-4 text-lg font-medium text-card-foreground">
                {t("share_deck")}
              </h2>
              <div className="p-4">
                <Share ENCODE_ID_BY_CARD={ENCODE_ID_BY_CARD} />
              </div>
            </div>
            <div className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b p-4 text-lg font-medium text-card-foreground">
                {t("analytics")}
              </h2>
              <div className="p-4">
                <Analytics cardsMapById={cardsMapById} />
              </div>
            </div>
            <div className="rounded-lg border bg-card shadow-sm">
              <h2 className="border-b p-4 text-lg font-medium text-card-foreground">
                {t("draw_simulator")}
              </h2>
              <div className="p-4">
                <DrawSimulator cardsMapById={{}} />
              </div>
            </div>
          </div>
        </div>
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-card text-card-foreground flex items-center gap-4 p-4 rounded-lg border shadow-lg",
              title: "font-medium",
              description: "text-muted-foreground text-sm",
            },
          }}
        />
      </BuildDeckStateProvider>
    </div>
  );
}
