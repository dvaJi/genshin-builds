"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";

import TCGCardComponent from "@components/genshin/TCGCard";
import Button from "@components/ui/Button";
import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import type { TCGCard } from "@interfaces/genshin";

type Props = {
  lang: string;
  cards: TCGCard[];
  types: string[];
};

function CardsTable({ lang, cards, types }: Props) {
  const [filteredCards, setFilteredCards] = useState<TCGCard[]>(cards);
  const [typeSelected, setTypeSelected] = useState("All");
  const [search, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search, 200);
  const { t } = useIntl("tcg_cards");

  useEffect(() => {
    let _filteredCards = cards;

    if (typeSelected !== "All") {
      _filteredCards = _filteredCards.filter(
        (card) => card.attributes.card_type === typeSelected
      );
    }

    if (debouncedSearchTerm !== "") {
      _filteredCards = _filteredCards.filter((card) =>
        card.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    setFilteredCards(_filteredCards);
  }, [cards, debouncedSearchTerm, typeSelected]);

  return (
    <>
      <div className="mx-2 flex gap-4 md:mx-0">
        <select
          value={typeSelected}
          onChange={(e) => setTypeSelected(e.target.value)}
          className="w-36 rounded-md border-vulcan-600 bg-vulcan-800 p-2"
        >
          <option value="All">{t("all")}</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search")}
          className="w-full rounded-md border-vulcan-600 bg-vulcan-800 p-2"
        />
        <Link href={`/${lang}/tcg/deck-builder`} prefetch={false}>
          <Button className="flex w-40 items-center justify-center">
            <FaPenToSquare className="mr-2 inline" />
            {t("create_deck")}
          </Button>
        </Link>
      </div>
      <div className="card flex flex-wrap content-center justify-center">
        {filteredCards.map((card, i) => (
          <Link
            key={card.id + i}
            href={`/${lang}/tcg/card/${card.id}`}
            className="group relative m-2 w-20 cursor-pointer rounded-lg border-2 border-transparent transition-all hover:scale-110  hover:border-white"
            prefetch={false}
          >
            <TCGCardComponent card={card} />
          </Link>
        ))}
      </div>
    </>
  );
}

export default CardsTable;
