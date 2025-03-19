"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Image from "@components/genshin/Image";
import Button from "@components/ui/Button";
import type { TCGCard } from "@interfaces/genshin";
import { useStore } from "@nanostores/react";
import { $deckBuilder } from "@state/deck-builder";

type Props = {
  cardsMapById: Record<string, TCGCard>;
};

function DrawSimulator({}: Props) {
  const deckBuilder = useStore($deckBuilder);
  const [drawCards, setDrawCards] = useState<string[]>([]);
  const t = useTranslations("Genshin.tcg_deck_builder");

  const allCards = [
    deckBuilder.characterCards,
    Object.entries(deckBuilder.actionCards).flatMap(([id, count]) =>
      Array(count).fill(id),
    ),
  ]
    .flat()
    .filter((id) => id !== "undefined");

  if (allCards.length < 30) {
    return t("min_cards_simulator");
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {drawCards.map((cardId, i) => (
          <div key={cardId + i}>
            <Image
              src={`/tcg/${cardId}.png`}
              alt={cardId}
              width={50}
              height={100}
            />
          </div>
        ))}
      </div>
      <Button
        onClick={() => {
          const newDrawCards = allCards
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
          setDrawCards(newDrawCards);
        }}
      >
        {t("draw_cards", { num: "5" })}
      </Button>
    </div>
  );
}

export default DrawSimulator;
