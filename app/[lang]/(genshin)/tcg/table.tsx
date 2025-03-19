"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";

import TCGCardComponent from "@components/genshin/TCGCard";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import useDebounce from "@hooks/use-debounce";
import { Link } from "@i18n/navigation";
import type { TCGCard } from "@interfaces/genshin";

type Props = {
  cards: TCGCard[];
  types: string[];
};

function CardsTable({ cards, types }: Props) {
  const [filteredCards, setFilteredCards] = useState<TCGCard[]>(cards);
  const [typeSelected, setTypeSelected] = useState("All");
  const [search, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search, 200);
  const t = useTranslations("Genshin.tcg_cards");

  useEffect(() => {
    let _filteredCards = cards;

    if (typeSelected !== "All") {
      _filteredCards = _filteredCards.filter(
        (card) => card.attributes.card_type === typeSelected,
      );
    }

    if (debouncedSearchTerm !== "") {
      _filteredCards = _filteredCards.filter((card) =>
        card.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    setFilteredCards(_filteredCards);
  }, [cards, debouncedSearchTerm, typeSelected]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full pl-10"
            />
          </div>

          <Select value={typeSelected} onValueChange={setTypeSelected}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t("all")}</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(type.toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Link href={`/tcg/deck-builder`}>
          <Button variant="primary" className="w-full lg:w-40">
            <FaPenToSquare className="mr-2" />
            {t("create_deck")}
          </Button>
        </Link>
      </div>
      <div className="card flex flex-wrap content-center justify-center gap-2">
        {filteredCards.map((card, i) => (
          <Link
            key={card.id + i}
            href={`/tcg/card/${card.id}`}
            className="group relative block cursor-pointer rounded-lg border-2 border-transparent transition-all hover:scale-105 hover:border-input"
          >
            <TCGCardComponent card={card} />
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="rounded-lg border border-input bg-card/50 px-6 py-12 text-center">
          <h3 className="text-lg font-medium text-foreground/80">
            {t("no_cards_found")}
          </h3>
          <p className="mt-2 text-muted-foreground">
            {t("try_adjusting_filters")}
          </p>
        </div>
      )}
    </div>
  );
}

export default CardsTable;
