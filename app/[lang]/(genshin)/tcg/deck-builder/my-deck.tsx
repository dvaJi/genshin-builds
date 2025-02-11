"use client";

import Image from "next/image";
import { memo } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

import useIntl from "@hooks/use-intl";
import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import { useStore } from "@nanostores/react";
import {
  $deckBuilder,
  addActionCardDeck,
  removeActionCardDeck,
  removeCharacterCardDeck,
} from "@state/deck-builder";

type Props = {
  cardsMapById: Record<string, TCGCard>;
};

function MyDeck({ cardsMapById }: Props) {
  const deckBuilder = useStore($deckBuilder);
  const { t } = useIntl("tcg_deck_builder");

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
        {deckBuilder.characterCards.map((card, i) => (
          <div
            key={"c" + card + i}
            className="group relative aspect-[1/1.7] w-full overflow-hidden rounded-lg border border-border/50"
          >
            {card === "undefined" ? (
              <div className="flex h-full items-center justify-center bg-card/50 p-2 text-center text-xs text-muted-foreground">
                {t("character_num", { num: `${i + 1}` })}
              </div>
            ) : (
              <>
                <div className="absolute left-1 top-1 z-10 rounded bg-card/90 px-1.5 py-0.5 text-xs font-medium text-card-foreground backdrop-blur-sm">
                  ♥ {cardsMapById[card].attributes.hp}
                </div>
                <button
                  onClick={() => removeCharacterCardDeck(card)}
                  className="absolute bottom-1 left-1 z-10 rounded bg-card/90 p-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-card-foreground group-hover:opacity-100"
                >
                  <FaMinus />
                </button>
                <Image
                  src={getUrl(`/tcg/${card}.png`, 80, 140)}
                  alt={cardsMapById[card].name}
                  title={cardsMapById[card].name}
                  width={76}
                  height={130}
                  data-tooltip-content={cardsMapById[card].name}
                  data-tooltip-id="deck_tooltip"
                  data-tooltip-place="bottom"
                  className="h-full w-full object-cover transition-all group-hover:scale-105"
                />
              </>
            )}
          </div>
        ))}
        {Object.entries(deckBuilder.actionCards).map(([card, amount]) => (
          <div
            key={card}
            className="group relative aspect-[1/1.7] w-full overflow-hidden rounded-lg border border-border/50"
          >
            {card === "undefined" ? (
              <div className="flex h-full items-center justify-center bg-card/50 p-2 text-center text-xs text-muted-foreground">
                {t("non_character_card_needed", { amount: amount.toString() })}
              </div>
            ) : (
              <>
                <div className="absolute left-1 top-1 z-10 rounded bg-card/90 px-1.5 py-0.5 text-xs font-medium text-card-foreground backdrop-blur-sm">
                  {cardsMapById[card].attributes.cost}
                </div>
                <div className="absolute bottom-1 left-1 z-10 flex items-center gap-1 rounded bg-card/90 px-1.5 py-0.5 text-xs backdrop-blur-sm">
                  <button
                    onClick={() => removeActionCardDeck(card)}
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-card-foreground group-hover:opacity-100"
                  >
                    <FaMinus />
                  </button>
                  <span className="font-medium text-card-foreground">
                    {amount}
                  </span>
                  <button
                    onClick={() => addActionCardDeck(card)}
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-card-foreground group-hover:opacity-100"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Image
                  src={getUrl(`/tcg/${card}.png`, 173, 101)}
                  alt={cardsMapById[card].name}
                  title={cardsMapById[card].name}
                  width={101}
                  height={173}
                  data-tooltip-content={cardsMapById[card].name}
                  data-tooltip-id="deck_tooltip"
                  data-tooltip-place="bottom"
                  className="h-full w-full object-cover transition-all group-hover:scale-105"
                />
              </>
            )}
          </div>
        ))}
      </div>
      <Tooltip id="deck_tooltip" className="z-40" />
    </div>
  );
}

export default memo(MyDeck);
