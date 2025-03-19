"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  LuArrowUpDown,
  LuAtom,
  LuCalendarDays,
  LuChevronDown,
  LuSparkles,
  LuText,
} from "react-icons/lu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@app/components/ui/collapsible";
import { CharacterCard } from "@components/genshin/CharacterCard";
import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import Input from "@components/ui/Input";
import type { Character } from "@interfaces/genshin";
import { cn } from "@lib/utils";
import { capitalize } from "@utils/capitalize";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

type Props = {
  characters: (Character & { beta?: boolean })[];
  elements: string[];
  weaponsTypes: string[];
  latestRelease: number;
};

type SortOption = "name" | "rarity" | "element" | "release";

export default function GenshinCharactersList({
  characters,
  elements,
  weaponsTypes,
  latestRelease,
}: Props) {
  const t = useTranslations("Genshin.characters");
  const [elementsFilter, setElementsFilter] = useState<string[]>([]);
  const [weaponFilter, setWeaponFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("release");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredAndSortedCharacters = useMemo(() => {
    return characters
      .filter((c) => {
        if (
          elementsFilter.length > 0 &&
          !elementsFilter.includes(c.element.id)
        ) {
          return false;
        }
        if (rarityFilter.length > 0 && !rarityFilter.includes(c.rarity)) {
          return false;
        }
        if (
          weaponFilter.length > 0 &&
          !weaponFilter.includes(c.weapon_type.id)
        ) {
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
            return sortOrder * (b.rarity - a.rarity);
          case "element":
            return sortOrder * a.element.name.localeCompare(b.element.name);
          case "release":
          default:
            return sortOrder * (b.release - a.release);
        }
      });
  }, [
    characters,
    elementsFilter,
    nameFilter,
    rarityFilter,
    weaponFilter,
    sortBy,
    sortAsc,
  ]);

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "release",
      label: t("sort_release"),
      icon: <LuCalendarDays className="h-4 w-4" />,
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
    {
      value: "element",
      label: t("sort_element"),
      icon: <LuAtom className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Search and Sort Controls - More compact on mobile */}
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

        {/* Replace Filter Toggle and Filters Section with Collapsible */}
        <Collapsible className="sm:hidden">
          <CollapsibleTrigger className="relative flex w-full items-center justify-between rounded-lg border border-input bg-card/50 p-3 text-sm font-medium text-foreground hover:bg-accent/5 active:translate-y-[1px] active:bg-accent/10">
            <div className="flex items-center gap-2">
              <span>Filters</span>
              {(elementsFilter.length > 0 ||
                weaponFilter.length > 0 ||
                rarityFilter.length > 0) && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/90 px-1.5 text-xs font-medium text-accent-foreground">
                  {elementsFilter.length +
                    weaponFilter.length +
                    rarityFilter.length}
                </span>
              )}
            </div>
            <LuChevronDown className="collapsible-trigger-icon h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="flex flex-col gap-2 rounded-lg border border-input bg-card/50 p-2.5">
              {/* Weapon Type Filter */}
              <div className="space-y-1.5 border-b border-input/50 pb-2.5 last:border-0 last:pb-0">
                <h3 className="text-xs font-medium text-foreground/70">
                  {t("weapon_filter")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {weaponsTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        if (weaponFilter.includes(type)) {
                          setWeaponFilter(
                            weaponFilter.filter((w) => w !== type),
                          );
                        } else {
                          setWeaponFilter([...weaponFilter, type]);
                        }
                      }}
                      className={cn(
                        "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                        weaponFilter.includes(type)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      data-active={weaponFilter.includes(type)}
                    >
                      <Image
                        src={`/weapons_type/${capitalize(type)}.png`}
                        alt={type}
                        width={16}
                        height={16}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                      />
                      <span className="truncate">{t(capitalize(type))}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Filter */}
              <div className="space-y-1.5 border-b border-input/50 pb-2.5 last:border-0 last:pb-0">
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

              {/* Element Filter */}
              <div className="space-y-1.5 border-b border-input/50 pb-2.5 last:border-0 last:pb-0">
                <h3 className="text-xs font-medium text-foreground/70">
                  {t("element_filter")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {elements.map((element) => (
                    <button
                      key={element}
                      onClick={() => {
                        if (elementsFilter.includes(element)) {
                          setElementsFilter(
                            elementsFilter.filter((e) => e !== element),
                          );
                        } else {
                          setElementsFilter([...elementsFilter, element]);
                        }
                      }}
                      className={cn(
                        "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                        elementsFilter.includes(element)
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      data-active={elementsFilter.includes(element)}
                    >
                      <ElementIcon
                        type={capitalize(element)}
                        height={16}
                        width={16}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                      />
                      <span className="truncate">
                        {t(element.toLowerCase())}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Desktop Filters - Always visible */}
        <div className="hidden sm:block">
          <div
            className={cn(
              "flex flex-col gap-3 rounded-lg border border-input bg-card/50 p-3 sm:gap-4 sm:p-4",
              "sm:block",
            )}
          >
            {/* Weapon Type Filter */}
            <div className="space-y-2 border-b border-input/50 pb-3 last:border-0 last:pb-0 sm:space-y-3 sm:border-0 sm:pb-0">
              <h3 className="text-xs font-medium text-foreground/70 sm:text-sm">
                {t("weapon_filter")}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {weaponsTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (weaponFilter.includes(type)) {
                        setWeaponFilter(weaponFilter.filter((w) => w !== type));
                      } else {
                        setWeaponFilter([...weaponFilter, type]);
                      }
                    }}
                    className={cn(
                      "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                      weaponFilter.includes(type)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    data-active={weaponFilter.includes(type)}
                  >
                    <Image
                      src={`/weapons_type/${capitalize(type)}.png`}
                      alt={type}
                      width={16}
                      height={16}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                    />
                    <span className="truncate">{t(capitalize(type))}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rarity Filter */}
            <div className="space-y-2 border-b border-input/50 pb-3 last:border-0 last:pb-0 sm:space-y-3 sm:border-0 sm:pb-0">
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

            {/* Element Filter */}
            <div className="space-y-2 border-b border-input/50 pb-3 last:border-0 last:pb-0 sm:space-y-3 sm:border-0 sm:pb-0">
              <h3 className="text-xs font-medium text-foreground/70 sm:text-sm">
                {t("element_filter")}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {elements.map((element) => (
                  <button
                    key={element}
                    onClick={() => {
                      if (elementsFilter.includes(element)) {
                        setElementsFilter(
                          elementsFilter.filter((e) => e !== element),
                        );
                      } else {
                        setElementsFilter([...elementsFilter, element]);
                      }
                    }}
                    className={cn(
                      "filter-button flex h-7 items-center gap-1 rounded-full px-1.5 text-[10px] font-medium transition-all sm:h-8 sm:gap-1.5 sm:px-2 sm:text-xs md:h-9 md:px-3 md:text-sm",
                      elementsFilter.includes(element)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    data-active={elementsFilter.includes(element)}
                  >
                    <ElementIcon
                      type={capitalize(element)}
                      height={16}
                      width={16}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5"
                    />
                    <span className="truncate">{t(element.toLowerCase())}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(elementsFilter.length > 0 ||
          weaponFilter.length > 0 ||
          rarityFilter.length > 0) && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {elementsFilter.map((element) => (
                <button
                  key={element}
                  onClick={() =>
                    setElementsFilter(
                      elementsFilter.filter((e) => e !== element),
                    )
                  }
                  className="flex h-6 items-center gap-1 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground sm:h-7 sm:gap-1.5 sm:px-2 sm:text-xs"
                >
                  <ElementIcon
                    type={capitalize(element)}
                    height={12}
                    width={12}
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  />
                  <span className="truncate">{t(element.toLowerCase())}</span>
                  <span className="ml-0.5 sm:ml-1">×</span>
                </button>
              ))}
              {weaponFilter.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setWeaponFilter(weaponFilter.filter((w) => w !== type))
                  }
                  className="flex h-6 items-center gap-1 rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground sm:h-7 sm:gap-1.5 sm:px-2 sm:text-xs"
                >
                  <Image
                    src={`/weapons_type/${capitalize(type)}.png`}
                    alt={type}
                    width={12}
                    height={12}
                    className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  />
                  <span className="truncate">{t(capitalize(type))}</span>
                  <span className="ml-0.5 sm:ml-1">×</span>
                </button>
              ))}
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
              onClick={() => {
                setElementsFilter([]);
                setWeaponFilter([]);
                setRarityFilter([]);
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground sm:text-xs"
            >
              {t("clear_all")}
            </button>
          </div>
        )}

        {/* Character Grid - Using dedicated CharacterCard component */}
        <div
          className="xs:grid-cols-5 grid grid-cols-4 gap-1.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8"
          style={{
            viewTransitionName: "character-grid",
            willChange: "transform, opacity",
          }}
        >
          {filteredAndSortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              latestRelease={latestRelease}
            />
          ))}
        </div>

        {/* Empty State - More compact on mobile */}
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
