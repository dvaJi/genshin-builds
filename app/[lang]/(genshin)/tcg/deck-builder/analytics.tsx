"use client";

import { useStore } from "@nanostores/react";
import Image from "next/image";
import { memo, useMemo } from "react";
import { Tooltip } from "react-tooltip";

import useIntl from "@hooks/use-intl";
import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
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
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col items-center rounded bg-vulcan-600 p-4">
          <h4 className="text-xl font-semibold text-slate-200">
            {stats.totalCharacterCards}+{stats.totalActionCards}
          </h4>
          <p className="text-sm">{t("total_cards")}</p>
        </div>
        <div className="flex flex-col items-center rounded bg-vulcan-600 p-4">
          <h4 className="text-xl font-semibold text-slate-200">
            {stats.totalCost}
          </h4>
          <p className="text-sm">{t("total_cost")}</p>
        </div>
        <div className="flex flex-col items-center rounded bg-vulcan-600 p-4">
          <h4 className="text-xl font-semibold text-slate-200">
            {stats.avgCost.toFixed(1)}
          </h4>
          <p className="text-sm">{t("average_cost_per_card")}</p>
        </div>
      </div>
      <div className="mt-4 rounded bg-vulcan-800 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th>{t("cost")}</th>
              <th>✦ 0</th>
              <th>✦ 1</th>
              <th>✦ 2</th>
              <th>✦ 3</th>
              <th>✦ 4</th>
              <th>✦ 5</th>
              <th>✦ 6</th>
              <th>✦ 7</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("number_of_cards")}</td>
              {Object.values(stats.costs).map((cost, i) => (
                <td className="text-center" key={i}>
                  {cost === 0 ? "-" : `x${cost}`}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded bg-vulcan-800 p-4">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th>
                <Image
                  src={getUrl(`/tcg/same.png`)}
                  alt="Same"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/unaligned_element.png`)}
                  alt="Unaligned Element"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/energy.png`)}
                  alt="Energy"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/anemo.png`)}
                  alt="Anemo"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/geo.png`)}
                  alt="Geo"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/electro.png`)}
                  alt="Electro"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/dendro.png`)}
                  alt="Dendro"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/hydro.png`)}
                  alt="Hydro"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/pyro.png`)}
                  alt="Pyro"
                  width={18}
                  height={18}
                />
              </th>
              <th>
                <Image
                  src={getUrl(`/tcg/cryo.png`)}
                  alt="Cryo"
                  width={18}
                  height={18}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(stats.cardsByType).map((count, i) => (
                <td key={i}>{count === 0 ? "---" : `x${count}`}</td>
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
