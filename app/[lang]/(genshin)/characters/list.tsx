"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  LuArrowUpDown,
  LuAtom,
  LuCalendarDays,
  LuSparkles,
  LuText,
} from "react-icons/lu";

import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import Input from "@components/ui/Input";
import useIntl from "@hooks/use-intl";
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
  const { t, locale } = useIntl("characters");
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
      label: t({ id: "sort_release", defaultMessage: "Release Date" }),
      icon: <LuCalendarDays className="h-4 w-4" />,
    },
    {
      value: "name",
      label: t({ id: "sort_name", defaultMessage: "Name" }),
      icon: <LuText className="h-4 w-4" />,
    },
    {
      value: "rarity",
      label: t({ id: "sort_rarity", defaultMessage: "Rarity" }),
      icon: <LuSparkles className="h-4 w-4" />,
    },
    {
      value: "element",
      label: t({ id: "sort_element", defaultMessage: "Element" }),
      icon: <LuAtom className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col gap-6">
        {/* Search and Sort Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t({
                id: "search",
                defaultMessage: "Search characters...",
              })}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="w-full pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value: string) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {sortOptions.find((opt) => opt.value === sortBy)?.icon}
                    <span>
                      {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
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
                "flex h-9 items-center rounded-md border border-input bg-background px-3 text-foreground transition-colors hover:bg-accent",
                sortAsc && "text-primary"
              )}
              title={t({
                id: sortAsc ? "sort_ascending" : "sort_descending",
                defaultMessage: sortAsc ? "Sort Ascending" : "Sort Descending",
              })}
            >
              <LuArrowUpDown
                className={cn("h-4 w-4", sortAsc && "rotate-180")}
              />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col gap-4 rounded-lg border border-input bg-card/50 p-4">
          {/* Weapon Type Filter */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground/80">
              {t({ id: "weapon_filter", defaultMessage: "Weapon Filter" })}
            </h3>
            <div className="flex flex-wrap gap-2">
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
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    weaponFilter.includes(type)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Image
                    src={`/weapons_type/${capitalize(type)}.png`}
                    alt={type}
                    width={20}
                    height={20}
                  />
                  <span>
                    {t({ id: capitalize(type), defaultMessage: type })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground/80">
              {t({ id: "rarity_filter", defaultMessage: "Rarity Filter" })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4].map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => {
                    if (rarityFilter.includes(rarity)) {
                      setRarityFilter(rarityFilter.filter((r) => r !== rarity));
                    } else {
                      setRarityFilter([...rarityFilter, rarity]);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    rarityFilter.includes(rarity)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="mr-px">⭐</span>
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground/80">
              {t({ id: "element_filter", defaultMessage: "Element Filter" })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {elements.map((element) => (
                <button
                  key={element}
                  onClick={() => {
                    if (elementsFilter.includes(element)) {
                      setElementsFilter(
                        elementsFilter.filter((e) => e !== element)
                      );
                    } else {
                      setElementsFilter([...elementsFilter, element]);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    elementsFilter.includes(element)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <ElementIcon
                    type={capitalize(element)}
                    height={20}
                    width={20}
                  />
                  <span>
                    {t({ id: element.toLowerCase(), defaultMessage: element })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {filteredAndSortedCharacters.map((character) => (
            <motion.div
              key={character.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/${locale}/character/${character.id}`}
                prefetch={false}
                className="group block"
              >
                <div className="relative">
                  <div
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-xl border-4 transition-all duration-300",
                      "border-input/70 hover:border-input",
                      `genshin-bg-rarity-${character.rarity}`
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        className="absolute left-1/2 top-1/2 z-20 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 scale-100 object-cover transition-transform duration-300 group-hover:scale-110"
                        alt={character.id}
                        src={`/characters/${character.id}/image.png`}
                        width={512}
                        height={512}
                        loading="lazy"
                      />
                      <ElementIcon
                        type={capitalize(character.element.id)}
                        height={24}
                        width={24}
                        className="absolute right-1 top-1 z-30 rounded-full bg-background/80 p-1 shadow-lg"
                      />

                      {/* Badges */}
                      <div className="absolute bottom-1 left-1 z-30 flex gap-1">
                        {character.beta && (
                          <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground shadow-lg">
                            Beta
                          </span>
                        )}
                        {latestRelease === character.release &&
                          !character.beta && (
                            <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white shadow-lg">
                              New
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-foreground">
                    {character.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedCharacters.length === 0 && (
          <div className="rounded-lg border border-input bg-card/50 px-6 py-12 text-center">
            <h3 className="text-lg font-medium text-foreground/80">
              {t({
                id: "no_characters_found",
                defaultMessage: "No characters found",
              })}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {t({
                id: "try_adjusting_filters",
                defaultMessage: "Try adjusting your filters or search term",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
