"use client";

import clsx from "clsx";
import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";

import { Input } from "@app/components/ui/input";
import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import type {
  TCGActionCard,
  TCGCard,
  TCGCharacterCard,
} from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import { useStore } from "@nanostores/react";
import {
  $deckBuilder,
  DECK_SETTINGS,
  type DeckBuilder,
  addActionCardDeck,
  addCharacterCardDeck,
} from "@state/deck-builder";

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
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border bg-card p-1">
        {Object.keys(cardsByType).map((type) => (
          <button
            key={type}
            onClick={() => setTabSelected(type)}
            className={clsx(
              "px-3 py-1.5 text-sm font-medium transition-colors",
              "rounded-md",
              tabSelected === type
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="grid grid-cols-5 gap-3 md:grid-cols-8">
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
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-card-foreground">
          {t("or_search")}
        </span>
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredCards.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-5 gap-3 md:grid-cols-8">
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
        </div>
      )}

      {filteredCards.length === 0 && search !== "" && (
        <div className="rounded-lg border bg-card/50 px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-card-foreground">
            {t("no_cards_found")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("try_adjusting_search")}
          </p>
        </div>
      )}

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
      className={clsx(
        "group relative aspect-[1/1.7] w-full overflow-hidden rounded-lg transition-all",
        {
          "pointer-events-none opacity-50":
            (isCharacter && deckBuilder.characterCards.includes(card.id)) ||
            (!isCharacter && deckBuilder.actionCards[card.id] === 2),
          "opacity-80": !isCharacter && deckBuilder.actionCards[card.id],
          "hover:ring-2 hover:ring-primary": true,
        }
      )}
      data-tooltip-id="cards_tooltip"
      data-tooltip-content={
        `${card.name} - ` +
        (isCharacter
          ? `HP: ${card.attributes.hp}`
          : `Cost: ${getEnergyValue(card)}`)
      }
      data-tooltip-place="bottom"
    >
      <div className="absolute left-1 top-1 z-10 rounded bg-card/90 px-1.5 py-0.5 text-xs font-medium text-card-foreground backdrop-blur-sm">
        {isCharacter ? `♥ ${card.attributes.hp}` : getEnergyValue(card)}
      </div>
      <Image
        src={getUrl(`/tcg/${card.id}.png`, 192, 113)}
        alt={card.name}
        width={113}
        height={192}
        className="h-full w-full object-cover transition-all group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
        <span className="text-xs font-medium text-white">{card.name}</span>
      </div>
    </button>
  );
}

export default memo(Cards);
