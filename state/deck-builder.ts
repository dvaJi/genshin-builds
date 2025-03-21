import { atom } from "nanostores";

export type DeckBuilder = {
  characterCards: string[];
  actionCards: { [key: string]: number };
  code?: string;
};

export const $deckBuilder = atom<DeckBuilder>({
  characterCards: ["undefined", "undefined", "undefined"],
  actionCards: { ["undefined"]: 30 },
});

export const DECK_SETTINGS = {
  MAX_CHARACTER_CARDS: 3,
  MAX_ACTION_CARDS: 30,
};

export const addCharacterCardDeck = (card: string) => {
  if (card === "undefined") return;
  const _deckBuilder = $deckBuilder.get();

  if (_deckBuilder.characterCards.includes(card)) return;

  const newCharacterCards = [..._deckBuilder.characterCards];
  const undefinedIndex = newCharacterCards.indexOf("undefined");

  if (undefinedIndex !== -1) {
    newCharacterCards[undefinedIndex] = card;
  }

  $deckBuilder.set({
    characterCards: newCharacterCards,
    actionCards: _deckBuilder.actionCards,
  });
};

export const removeCharacterCardDeck = (card: string) => {
  if (card === "undefined") return;

  const _deckBuilder = $deckBuilder.get();

  $deckBuilder.set({
    actionCards: _deckBuilder.actionCards,
    characterCards: _deckBuilder.characterCards.map((c) =>
      c === card ? "undefined" : c,
    ),
  });
};

export const addActionCardDeck = (card: string) => {
  if (card === "undefined") return;

  const _deckBuilder = $deckBuilder.get();

  const newActionCards = {
    ..._deckBuilder.actionCards,
    [card]: _deckBuilder.actionCards[card]
      ? _deckBuilder.actionCards[card] + 1
      : 1,
  };

  // Remove 1 undefined card
  if (_deckBuilder.actionCards["undefined"]) {
    newActionCards["undefined"] = _deckBuilder.actionCards["undefined"] - 1;

    if (newActionCards["undefined"] === 0) {
      delete newActionCards["undefined"];
    }
  }

  $deckBuilder.set({
    characterCards: _deckBuilder.characterCards,
    actionCards: newActionCards,
  });
};

export const removeActionCardDeck = (card: string) => {
  if (card === "undefined") return;

  const _deckBuilder = $deckBuilder.get();

  const newActionCards = {
    ..._deckBuilder.actionCards,
    [card]: _deckBuilder.actionCards[card] - 1,
  };

  if (newActionCards[card] === 0) {
    delete newActionCards[card];
  }

  newActionCards["undefined"] = newActionCards["undefined"]
    ? newActionCards["undefined"] + 1
    : 1;

  $deckBuilder.set({
    characterCards: _deckBuilder.characterCards,
    actionCards: newActionCards,
  });
};
