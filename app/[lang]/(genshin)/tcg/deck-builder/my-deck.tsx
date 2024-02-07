"use client";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import { memo } from "react";

import useIntl from "@hooks/use-intl";
import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import {
  $deckBuilder,
  addActionCardDeck,
  removeActionCardDeck,
  removeCharacterCardDeck,
} from "@state/deck-builder";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";

type Props = {
  cardsMapById: Record<string, TCGCard>;
};

function MyDeck({ cardsMapById }: Props) {
  const deckBuilder = useStore($deckBuilder);
  const { t } = useIntl("tcg_deck_builder");

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 md:justify-normal">
        {deckBuilder.characterCards.map((card, i) => (
          <div
            key={"c" + card + i}
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-vulcan-200/20"
          >
            {card === "undefined" ? (
              <div className="flex h-[130px] w-[76px] items-center justify-center overflow-hidden rounded-xl border-2 border-transparent text-xs">
                {t("character_num", { num: `${i + 1}` })}
              </div>
            ) : (
              <>
                <div
                  className={`absolute left-0 top-1 rounded bg-vulcan-800 px-1 text-xs text-slate-200`}
                >
                  ♥ {cardsMapById[card].attributes.hp}
                </div>
                <button
                  onClick={() => removeCharacterCardDeck(card)}
                  className="absolute bottom-1 rounded bg-vulcan-800 px-1 text-xs"
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
                  className="h-[130px] w-[76px] rounded-xl border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
                />
              </>
            )}
          </div>
        ))}
        {Object.entries(deckBuilder.actionCards).map(([card, amount]) => (
          <div
            key={card}
            className="relative flex flex-col items-center justify-center rounded-xl border-2 border-vulcan-200/20"
          >
            {card === "undefined" ? (
              <div className="flex h-[130px] w-[76px] items-center justify-center overflow-hidden rounded-xl border-2 border-transparent text-center text-xxs">
                {t("non_character_card_needed", { amount: amount.toString() })}
              </div>
            ) : (
              <>
                <div
                  className={`absolute left-0 top-1 rounded bg-vulcan-800 px-1 text-xs text-slate-200`}
                >
                  {cardsMapById[card].attributes.cost}
                </div>
                <div className="absolute bottom-1 flex rounded bg-vulcan-800 text-xs">
                  <button
                    onClick={() => removeActionCardDeck(card)}
                    className="px-1 opacity-30 transition-all hover:opacity-100"
                  >
                    <FaMinus />
                  </button>
                  {amount}
                  <button
                    onClick={() => addActionCardDeck(card)}
                    className="px-1 opacity-30 transition-all hover:opacity-100"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Image
                  src={getUrl(`/tcg/${card}.png`, 80, 140)}
                  alt={cardsMapById[card].name}
                  title={cardsMapById[card].name}
                  width={76}
                  height={130}
                  data-tooltip-content={cardsMapById[card].name}
                  data-tooltip-id="deck_tooltip"
                  data-tooltip-place="bottom"
                  className="h-[130px] w-[76px] rounded-xl border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
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
