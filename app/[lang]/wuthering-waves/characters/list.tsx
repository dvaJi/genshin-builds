"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  LuArrowUpDown,
  LuChevronDown,
  LuSparkles,
  LuText,
} from "react-icons/lu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@app/components/ui/collapsible";
import Input from "@components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import Image from "@components/wuthering-waves/Image";
import { Link } from "@i18n/navigation";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { cn } from "@lib/utils";

type Props = {
  characters: Characters[];
};

type SortOption = "name" | "rarity" | "release";

export default function WWCharactersList({ characters }: Props) {
  const t = useTranslations("WW.home");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rarity");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredAndSortedCharacters = useMemo(() => {
    return characters
      .filter((c) => {
        if (rarityFilter.length > 0 && !rarityFilter.includes(c.rarity)) {
          return false;
        }
        if (!c.name.toLowerCase().includes(nameFilter.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const sortOrder = sortAsc ? 1 : -1;
        switch (sortBy) {
          case "name":
            return sortOrder * a.name.localeCompare(b.name);
          case "rarity":
          default:
            return sortOrder * (b.rarity - a.rarity);
        }
      });
  }, [characters, nameFilter, rarityFilter, sortBy, sortAsc]);

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "release",
      label: t("sort_release"),
      icon: <LuText className="h-4 w-4" />,
    },
    {
      value: "name",
      label: t("sort_name"),
      icon: <LuText className="h-4 w-4" />,
    },
    {
      value: "rarity",
      label: t("sort_rarity"),
      icon: <LuSparkles className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Search and Sort Controls */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:left-2.5 sm:h-4 sm:w-4" />
            <Input
              type="text"
              placeholder={t("search")}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="h-8 w-full pl-7 text-xs sm:h-9 sm:pl-8 sm:text-sm md:h-10 md:text-base"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="h-8 min-w-[120px] text-xs sm:h-9 sm:min-w-[140px] sm:text-sm md:h-10 md:min-w-[180px] md:text-base">
                <SelectValue>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {sortOptions.find((opt) => opt.value === sortBy)?.icon}
                    <span className="truncate">
                      {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent sm:h-9 sm:w-9 md:h-10 md:w-10",
                sortAsc && "text-primary hover:text-accent-foreground",
              )}
              title={sortAsc ? t("sort_ascending") : t("sort_descending")}
            >
              <LuArrowUpDown
                className={cn(
                  "h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]",
                  sortAsc && "rotate-180",
                )}
              />
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        <Collapsible className="sm:hidden">
          <CollapsibleTrigger className="relative flex w-full items-center justify-between rounded-lg border border-input bg-card/50 p-3 text-sm font-medium text-foreground hover:bg-accent/5 active:translate-y-[1px] active:bg-accent/10">
            <div className="flex items-center gap-2">
              <span>{t("filters")}</span>
              {rarityFilter.length > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/90 px-1.5 text-xs font-medium text-accent-foreground">
                  {rarityFilter.length}
                </span>
              )}
            </div>
            <LuChevronDown className="collapsible-trigger-icon h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="flex flex-col gap-2 rounded-lg border border-input bg-card/50 p-2.5">
              {/* Rarity Filter */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-medium text-foreground/70">
                  {t("rarity_filter")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 4].map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => {
                        if (rarityFilter.includes(rarity)) {
                          setRarityFilter(
                            rarityFilter.filter((r) => r !== rarity),
                          );
                        } else {
                          setRarityFilter([...rarityFilter, rarity]);
                        }
                      }}
                      className={cn(
                        "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                        rarityFilter.includes(rarity)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      data-active={rarityFilter.includes(rarity)}
                    >
                      <span className="mr-px">⭐</span>
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Desktop Filters */}
        <div className="hidden sm:block">
          <div className="flex flex-col gap-3 rounded-lg border border-input bg-card/50 p-3 sm:gap-4 sm:p-4">
            {/* Rarity Filter */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-xs font-medium text-foreground/70 sm:text-sm">
                {t("rarity_filter")}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[5, 4].map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => {
                      if (rarityFilter.includes(rarity)) {
                        setRarityFilter(
                          rarityFilter.filter((r) => r !== rarity),
                        );
                      } else {
                        setRarityFilter([...rarityFilter, rarity]);
                      }
                    }}
                    className={cn(
                      "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                      rarityFilter.includes(rarity)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    data-active={rarityFilter.includes(rarity)}
                  >
                    <span className="mr-px">⭐</span>
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {rarityFilter.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {rarityFilter.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() =>
                    setRarityFilter(rarityFilter.filter((r) => r !== rarity))
                  }
                  className="flex h-6 items-center gap-1 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground sm:h-7 sm:gap-1.5 sm:px-2 sm:text-xs"
                >
                  <span>⭐{rarity}</span>
                  <span className="ml-0.5 sm:ml-1">×</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setRarityFilter([])}
              className="text-[10px] text-muted-foreground hover:text-foreground sm:text-xs"
            >
              {t("clear_all")}
            </button>
          </div>
        )}

        {/* Character Grid */}
        <div className="xs:grid-cols-5 grid grid-cols-4 gap-1.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
          {filteredAndSortedCharacters.map((char) => (
            <Link
              key={char.id}
              href={`/wuthering-waves/characters/${char.id}`}
              className="group flex flex-col items-center justify-center gap-1.5"
              title={`${char.name} build`}
            >
              <div
                className={cn(
                  `overflow-hidden rounded transition-all rarity-${char.rarity} ring-0 ring-primary group-hover:ring-4`,
                )}
              >
                <Image
                  className="transition-transform ease-in-out group-hover:scale-110"
                  src={`/characters/thumb_${char.id}.webp`}
                  alt={char.name}
                  width={124}
                  height={124}
                />
              </div>
              <div className="w-full rounded bg-black/75 px-1.5 py-1 sm:bg-transparent sm:px-0 sm:py-0">
                <h2 className="sm:text-shadow-none truncate text-center text-xs font-medium text-white text-shadow-sm group-hover:text-ww-100 md:text-sm">
                  {char.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCharacters.length === 0 && (
          <div className="rounded-lg border border-input bg-card/50 px-4 py-8 text-center sm:px-6 sm:py-12">
            <h3 className="text-base font-medium text-foreground/80 sm:text-lg">
              {t("no_characters_found")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
              {t("try_adjusting_filters")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
