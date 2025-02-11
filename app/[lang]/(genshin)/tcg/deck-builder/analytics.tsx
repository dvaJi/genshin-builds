"use client";

import Image from "next/image";
import { memo, useMemo } from "react";
import { Tooltip } from "react-tooltip";

import useIntl from "@hooks/use-intl";
import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
import { useStore } from "@nanostores/react";
import { $deckBuilder } from "@state/deck-builder";

type Props = {
  cardsMapById: Record<string, TCGCard>;
};

function Analytics({ cardsMapById }: Props) {
  const deck = useStore($deckBuilder);
  const { t } = useIntl("tcg_deck_builder");

  const stats = useMemo(() => {
    let totalCharacterCards = 0;
    let totalActionCards = 0;
    let totalCost = 0;
    let avgCost = 0;
    let costs = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
    };
    let cardsByType: { [key: string]: number } = {
      matching_element: 0,
      unaligned_element: 0,
      energy: 0,
      anemo: 0,
      geo: 0,
      electro: 0,
      dendro: 0,
      hydro: 0,
      pyro: 0,
      cryo: 0,
    };

    deck.characterCards.forEach((card) => {
      if (card !== "undefined") {
        totalCharacterCards++;
      }
    });

    Object.entries(deck.actionCards).forEach(([card, count]) => {
      if (card === "undefined") {
        return;
      }
      totalActionCards += count;

      const cardData = cardsMapById[card];

      cardData.attributes.energy.forEach((type) => {
        cardsByType[type.id] += count;
        totalCost += type.count * count;
        costs[type.count as keyof typeof costs] += count;
      });
    });

    if (totalCharacterCards + totalActionCards > 0) {
      avgCost = totalCost / (totalCharacterCards + totalActionCards);
    }

    return {
      totalCharacterCards,
      totalActionCards,
      totalCost,
      avgCost,
      costs,
      cardsByType,
    };
  }, [cardsMapById, deck.actionCards, deck.characterCards]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-card p-4 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-card-foreground">
            {stats.totalCharacterCards}+{stats.totalActionCards}
          </h4>
          <p className="text-sm text-muted-foreground">{t("total_cards")}</p>
        </div>
        <div className="rounded-lg bg-card p-4 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-card-foreground">
            {stats.totalCost}
          </h4>
          <p className="text-sm text-muted-foreground">{t("total_cost")}</p>
        </div>
        <div className="rounded-lg bg-card p-4 text-center shadow-sm">
          <h4 className="text-xl font-semibold text-card-foreground">
            {stats.avgCost.toFixed(1)}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("average_cost_per_card")}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium text-card-foreground">
                {t("cost")}
              </th>
              {Array.from({ length: 8 }).map((_, i) => (
                <th
                  key={i}
                  className="text-center font-medium text-card-foreground"
                >
                  ✦ {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-muted-foreground">
                {t("number_of_cards")}
              </td>
              {Object.values(stats.costs).map((cost, i) => (
                <td key={i} className="text-center text-muted-foreground">
                  {cost === 0 ? "-" : `x${cost}`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {[
                "same",
                "unaligned_element",
                "energy",
                "anemo",
                "geo",
                "electro",
                "dendro",
                "hydro",
                "pyro",
                "cryo",
              ].map((type) => (
                <th key={type} className="px-2">
                  <Image
                    src={getUrl(`/tcg/${type}.png`)}
                    alt={type}
                    width={18}
                    height={18}
                    className="mx-auto"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(stats.cardsByType).map((count, i) => (
                <td key={i} className="text-center text-muted-foreground">
                  {count === 0 ? "---" : `x${count}`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Tooltip id="analytics_tooltip" className="z-40" />
    </div>
  );
}

export default memo(Analytics);
