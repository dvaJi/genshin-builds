import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import Button from "@components/ui/Button";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import type {
  TCGActionCard,
  TCGCard,
  TCGCharacterCard,
} from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { decodeDeckCode } from "@utils/gcg-share-code";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ lang: string; code: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, code } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.tcg_cards",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/tcg/deck/${code}`,
    locale: lang,
  });
}

export default async function GenshinTCG({ params }: Props) {
  const { lang, code } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.tcg_cards");
  const langData = getLangData(lang, "genshin");

  const acards = await getGenshinData<TCGActionCard[]>({
    resource: "tcgActions",
    language: langData,
    select: ["_id", "name", "id", "shareId"],
  });
  const ccards = await getGenshinData<TCGCharacterCard[]>({
    resource: "tcgCharacters",
    language: langData,
    select: ["_id", "name", "id", "shareId"],
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

  const decodedDeck = decodeDeckCode(
    decodeURIComponent(code),
    CARD_BY_ENCODE_ID,
  );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t("deck")}:{" "}
        {decodedDeck.characterCards
          .map((card) => cardsMapById[card].name)
          .join(" / ")}
      </h2>
      <Link href={`/tcg/deck-builder?code=${code}`} prefetch={false}>
        <Button>{t("edit")}</Button>
      </Link>
      <div className="card flex flex-wrap content-center justify-center">
        <div className="flex flex-wrap content-center justify-center">
          {decodedDeck.characterCards.map((card) => (
            <Link
              key={card}
              href={`/tcg/card/${card}`}
              className="group relative cursor-pointer transition-all"
            >
              <Image
                src={getUrl(`/tcg/${card}.png`, 170, 310)}
                alt={cardsMapById[card].name}
                title={cardsMapById[card].name}
                width={170}
                height={310}
                className="w-28 rounded-xl border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125 md:w-36"
              />
              <div className="mt-1 text-center text-xs transition-all group-hover:text-white">
                {cardsMapById[card].name}
              </div>
            </Link>
          ))}
        </div>
        <div className="relative flex flex-wrap content-center justify-center">
          {Object.entries(decodedDeck.actionCards).map(([card, amount]) => (
            <Link
              key={card}
              href={`/tcg/card/${card}`}
              className="group relative m-2 w-20 cursor-pointer transition-all hover:scale-110"
            >
              <Image
                src={getUrl(`/tcg/${card}.png`, 150, 90)}
                alt={cardsMapById[card].name}
                title={cardsMapById[card].name}
                width={80}
                height={134}
                className="rounded-lg border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
              />
              <div className="mt-1 text-center text-xs transition-all group-hover:text-white">
                {cardsMapById[card].name} x {amount}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
