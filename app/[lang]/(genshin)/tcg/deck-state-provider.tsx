"use client";

import { useEffect } from "react";

import { $deckBuilder, type DeckBuilder } from "@state/deck-builder";

type Props = {
  children: React.ReactNode;
  initialDeck?: DeckBuilder;
};

export default function BuildDeckStateProvider({
  children,
  initialDeck,
}: Props) {
  useEffect(() => {
    if (initialDeck) {
      $deckBuilder.set(initialDeck);
    }
  }, [initialDeck]);

  return <>{children}</>;
}
