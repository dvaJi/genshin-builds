"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  LuArrowUpDown,
  LuChevronDown,
  LuSparkles,
  LuSword,
  LuText,
} from "react-icons/lu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@app/components/ui/collapsible";
import StarRarity from "@components/StarRarity";
import Image from "@components/genshin/Image";
import Input from "@components/ui/Input";
import { Link } from "@i18n/navigation";
import type { Weapon } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";
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
  weapons: (Weapon & { beta?: boolean })[];
  weaponTypes: string[];
};

type SortOption = "name" | "rarity" | "type";

export default function WeaponsList({ weapons, weaponTypes }: Props) {
  const t = useTranslations("Genshin.weapons");
  const [weaponFilter, setWeaponFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [rarityFilter, setRarityFilter] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rarity");
  const [sortAsc, setSortAsc] = useState(true);

  const filteredAndSortedWeapons = useMemo(() => {
    return weapons
      .filter((w) => {
        if (weaponFilter.length > 0 && !weaponFilter.includes(w.type.id)) {
          return false;
        }
        if (rarityFilter.length > 0 && !rarityFilter.includes(w.rarity)) {
          return false;
        }
        if (!w.name.toLowerCase().includes(nameFilter.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const sortOrder = sortAsc ? 1 : -1;
        switch (sortBy) {
          case "name":
            return sortOrder * a.name.localeCompare(b.name);
          case "type":
            return sortOrder * a.type.name.localeCompare(b.type.name);
          case "rarity":
          default:
            return sortOrder * (b.rarity - a.rarity);
        }
      });
  }, [weapons, weaponFilter, nameFilter, rarityFilter, sortBy, sortAsc]);

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "rarity",
      label: t("sort_rarity"),
      icon: <LuSparkles className="h-4 w-4" />,
    },
    {
      value: "name",
      label: t("sort_name"),
      icon: <LuText className="h-4 w-4" />,
    },
    {
      value: "type",
      label: t("sort_type"),
      icon: <LuSword className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-2 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-6">
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
              {(weaponFilter.length > 0 || rarityFilter.length > 0) && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/90 px-1.5 text-xs font-medium text-accent-foreground">
                  {weaponFilter.length + rarityFilter.length}
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
                  {weaponTypes.map((type) => (
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
                  {[5, 4, 3].map((rarity) => (
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
            {/* Weapon Type Filter */}
            <div className="space-y-2 border-b border-input/50 pb-3 last:border-0 last:pb-0 sm:space-y-3 sm:border-0 sm:pb-0">
              <h3 className="text-xs font-medium text-foreground/70 sm:text-sm">
                {t("weapon_filter")}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {weaponTypes.map((type) => (
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
                {[5, 4, 3].map((rarity) => (
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
        {(weaponFilter.length > 0 || rarityFilter.length > 0) && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                setWeaponFilter([]);
                setRarityFilter([]);
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground sm:text-xs"
            >
              {t("clear_all")}
            </button>
          </div>
        )}

        {/* Weapons Grid */}
        <div
          className="xs:grid-cols-4 grid grid-cols-3 gap-1 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8"
          style={{
            viewTransitionName: "weapons-grid",
            willChange: "transform, opacity",
          }}
        >
          {filteredAndSortedWeapons.map((weapon) => (
            <Link
              key={weapon.id}
              href={`/weapon/${weapon.id}`}
              className="group relative inline-block scale-100 rounded-lg bg-muted transition-all hover:scale-105 hover:bg-accent hover:shadow-lg"
            >
              {/* Beta Badge */}
              {weapon.beta && (
                <div className="absolute left-1 top-1 z-50 flex items-center justify-center rounded bg-vulcan-700/80 p-0.5 shadow">
                  <span className="xs:text-xxs text-[10px] text-white">
                    Beta
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "flex flex-row justify-center rounded-t-lg rounded-br-3xl bg-cover",
                  `genshin-bg-rarity-${weapon.rarity}`,
                )}
              >
                <span>
                  <img
                    src={getUrl(`/weapons/${weapon.id}.png`, 140, 140)}
                    alt={weapon.name}
                    className="aspect-square w-full rounded-t-lg rounded-br-3xl object-cover"
                  />
                </span>
                <div className="xs:bottom-9 absolute bottom-8 sm:bottom-10">
                  <StarRarity
                    starClassname="w-3 xs:w-4 sm:w-5"
                    rarity={weapon.rarity}
                    starsSize={46}
                  />
                </div>
              </div>
              <h3 className="xs:h-8 xs:text-xs flex h-7 items-center justify-center overflow-hidden rounded-b-lg px-1 text-center text-[10px] leading-none text-slate-200 group-hover:text-accent-foreground sm:h-9 sm:text-sm">
                {weapon.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedWeapons.length === 0 && (
          <div className="rounded-lg border border-input bg-card/50 px-3 py-6 text-center sm:px-6 sm:py-12">
            <h3 className="text-sm font-medium text-foreground/80 sm:text-lg">
              {t("no_weapons_found")}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">
              {t("try_adjusting_filters")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
