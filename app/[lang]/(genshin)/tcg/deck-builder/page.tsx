import type {
  TCGActionCard,
  TCGCard,
  TCGCharacterCard,
} from "@interfaces/genshin";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { Toaster } from "sonner";

import { genPageMetadata } from "@app/seo";
import Alert from "@components/Alert";
import BuildDeckStateProvider from "../deck-state-provider";
import Analytics from "./analytics";
import Cards from "./cards";
import DrawSimulator from "./draw-simulator";
import MyDeck from "./my-deck";
import Share from "./share";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { decodeDeckCode } from "@utils/gcg-share-code";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-dynamic";

type Props = {
  params: { lang: string };
  searchParams: Record<string, string>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_deck_builder"
  );

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/tcg/deck-builder`,
    locale,
    noOpenGraph: true,
  });
}

export default async function GenshinTCG({ params, searchParams }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "tcg_deck_builder"
  );

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
    cards.map((card) => [card.id, card])
  ) as Record<string, TCGCard>;

  const CARD_ORDER = cards
    .filter((card) => card.shareId !== 0)
    .sort((a, b) => a.shareId - b.shareId)
    .map((card) => card.id);

  const CARD_BY_ENCODE_ID: Record<number, string> = Object.fromEntries(
    CARD_ORDER.map((card, index) => [index + 1, card])
  );

  const ENCODE_ID_BY_CARD: Record<string, number> = Object.fromEntries(
    CARD_ORDER.map((card, index) => [card, index + 1])
  ) as Record<string, number>;

  const decodedDeck = searchParams.code
    ? decodeDeckCode(decodeURIComponent(searchParams.code), CARD_BY_ENCODE_ID)
    : {
        characterCards: ["undefined", "undefined", "undefined"],
        actionCards: { ["undefined"]: 30 },
      };

  return (
    <div className="relative">
      <BuildDeckStateProvider
        initialDeck={{ ...decodedDeck, code: searchParams.code }}
      >
        {searchParams.code && decodedDeck.characterCards[0] === "undefined" ? (
          <div className="absolute left-0 right-0 top-0 flex items-center justify-center">
            <Alert
              className="flex rounded bg-red-400 px-6 py-2 text-center text-red-800"
              closeClassName="text-red-900 font-semibold hover:text-black"
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
          <div className="md:col-span-2">
            <h1 className="my-6 text-2xl font-semibold text-gray-200">
              {t("title")}
            </h1>
            <div>
              <h2 className="my-2 text-xl font-semibold text-gray-300">
                {t("my_deck")}
              </h2>
              <MyDeck cardsMapById={cardsMapById} />
            </div>
            <div className="mt-4">
              <h2 className="my-2 text-xl font-semibold text-gray-300">
                {t("cards")}
              </h2>
              <Cards actions={acards} characters={ccards} />
            </div>
          </div>

          <div>
            <div>
              <h2 className="my-2 text-xl font-semibold text-gray-300">
                {t("share_deck")}
              </h2>
              <div className="flex justify-between bg-vulcan-800 p-4">
                <Share ENCODE_ID_BY_CARD={ENCODE_ID_BY_CARD} />
              </div>
            </div>
            <div>
              <h2 className="my-2 text-xl font-semibold text-gray-300">
                {t("analytics")}
              </h2>
              <div className="">
                <Analytics cardsMapById={cardsMapById} />
              </div>
            </div>
            <div>
              <h2 className="my-2 text-xl font-semibold text-gray-300">
                {t("draw_simulator")}
              </h2>
              <div className="bg-vulcan-800 p-4">
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
                "bg-vulcan-800 items-center gap-4 flex p-4 rounded-xl shadow-xl",
              title: "inline text-slate-50 font-bold",
              description: "text-slate-100",
            },
          }}
        />
      </BuildDeckStateProvider>
    </div>
  );
}
