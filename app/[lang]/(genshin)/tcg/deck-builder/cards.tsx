"use client";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";

import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import type {
  TCGActionCard,
  TCGCard,
  TCGCharacterCard,
} from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import {
  $deckBuilder,
  DECK_SETTINGS,
  addActionCardDeck,
  addCharacterCardDeck,
  type DeckBuilder,
} from "@state/deck-builder";
import clsx from "clsx";

type Props = {
  characters: TCGCharacterCard[];
  actions: TCGActionCard[];
};

function Cards({ actions, characters }: Props) {
  const deckBuilder = useStore($deckBuilder);
  const charactersTab = characters[0].attributes.card_type;
  const [tabSelected, setTabSelected] = useState<string>(charactersTab);
  const [filteredCards, setFilteredCards] = useState<TCGCard[]>([]);
  const [search, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search, 200, 2);
  const { t } = useIntl("tcg_deck_builder");

  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setFilteredCards(
        (characters as TCGCard[])
          .concat(actions as TCGCard[])
          .filter((card) =>
            card.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          )
      );
    }
  }, [actions, characters, debouncedSearchTerm]);

  const cardsByType = useMemo(() => {
    const _actions = actions.reduce(
      (acc, action) => {
        if (!acc[action.attributes.card_type]) {
          acc[action.attributes.card_type] = [];
        }

        if (acc[action.attributes.card_type]) {
          acc[action.attributes.card_type].push(action);
        }
        return acc;
      },
      {} as Record<string, TCGActionCard[]>
    );
    return {
      [charactersTab]: characters,
      ..._actions,
    } as unknown as Record<string, TCGCard[]>;
  }, [actions, characters, charactersTab]);

  return (
    <div>
      <div className="flex ">
        {Object.keys(cardsByType).map((type) => (
          <button
            key={type}
            onClick={() => setTabSelected(type)}
            className={`${
              tabSelected === type
                ? "bg-vulcan-800 text-white"
                : "text-vulcan-800  hover:bg-vulcan-600"
            } rounded-t px-4 py-2 hover:text-white`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 bg-vulcan-800 p-3">
        {cardsByType[tabSelected].map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            deckBuilder={deckBuilder}
            maxCharactersErrorMessage={t("max_character_cards_error")}
            maxActionsErrorMessage={t("max_non_character_cards_error")}
          />
        ))}
      </div>
      <div>
        <div className="mt-4">
          <span className="text-xl font-semibold">{t("or_search")}</span>
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            className="ml-4 rounded border-vulcan-600 bg-vulcan-900"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filteredCards.length > 0 ? (
          <div className="flex flex-wrap gap-2 bg-vulcan-800 p-3">
            {filteredCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                deckBuilder={deckBuilder}
                maxCharactersErrorMessage={t("max_character_cards_error")}
                maxActionsErrorMessage={t("max_non_character_cards_error")}
              />
            ))}
          </div>
        ) : null}
        {filteredCards.length === 0 && search !== "" ? (
          <div className="text-center text-gray-300">{t("no_cards_found")}</div>
        ) : null}
      </div>
      <Tooltip id="cards_tooltip" className="z-40" />
    </div>
  );
}

type CardProps = {
  card: TCGCard;
  deckBuilder: DeckBuilder;
  maxCharactersErrorMessage: string;
  maxActionsErrorMessage: string;
};

function CardComponent({
  card,
  deckBuilder,
  maxCharactersErrorMessage,
  maxActionsErrorMessage,
}: CardProps) {
  const isCharacter = card.attributes.hp !== undefined;
  function getEnergyValue(card: TCGCard) {
    if (Array.isArray(card.attributes.energy)) {
      return card.attributes.energy.length > 0
        ? card.attributes.energy.map((type) => type.count ?? "0").join("+")
        : "0";
    } else {
      return card.attributes.energy ?? 0;
    }
  }

  return (
    <button
      onClick={() => {
        if (isCharacter) {
          const totalChars = deckBuilder.characterCards.filter(
            (c) => c !== "undefined"
          ).length;
          if (totalChars >= DECK_SETTINGS.MAX_CHARACTER_CARDS) {
            toast.error("Error", {
              description: maxCharactersErrorMessage,
            });
            return;
          }
          addCharacterCardDeck(card.id);
        } else {
          const totalActions = Object.entries(deckBuilder.actionCards).reduce(
            (acc, [key, amount]) => (key === "undefined" ? acc : acc + amount),
            0
          );
          if (totalActions >= DECK_SETTINGS.MAX_ACTION_CARDS) {
            toast.error("Error", {
              description: maxActionsErrorMessage,
            });
            return;
          }
          addActionCardDeck(card.id);
        }
      }}
      className={clsx(`relative rounded`, {
        "pointer-events-none saturate-0":
          (isCharacter && deckBuilder.characterCards.includes(card.id)) ||
          (!isCharacter && deckBuilder.actionCards[card.id] === 2),
        "saturate-80": !isCharacter && deckBuilder.actionCards[card.id],
      })}
      data-tooltip-id="cards_tooltip"
      data-tooltip-content={
        `${card.name} - ` +
        (isCharacter
          ? `HP: ${card.attributes.hp}`
          : `Cost: ${getEnergyValue(card)}`)
      }
      data-tooltip-place="bottom"
    >
      <div
        className={`absolute -left-1 top-1 rounded bg-vulcan-800 px-1 text-xxs text-slate-200`}
      >
        {isCharacter ? `♥ ${card.attributes.hp}` : getEnergyValue(card)}
      </div>
      <Image
        src={getUrl(`/tcg/${card.id}.png`, 50, 85)}
        alt={card.name}
        width={50}
        height={85}
      />
    </button>
  );
}

export default memo(Cards);
