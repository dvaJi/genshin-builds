"use client";

import { TeamData } from "interfaces/teams";
import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { LuArrowUpDown, LuChevronDown, LuText, LuUser } from "react-icons/lu";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@app/components/ui/collapsible";
import ElementIcon from "@components/genshin/ElementIcon";
import TeamCard from "@components/genshin/TeamCard";
import Input from "@components/ui/Input";
import useIntl from "@hooks/use-intl";
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
  teamsByName: Record<string, TeamData[]>;
  elements: string[];
};

type SortOption = "character" | "element";

export default function GenshinTeamsList({ teamsByName, elements }: Props) {
  const { t } = useIntl("teams");
  const [elementsFilter, setElementsFilter] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("character");
  const [sortAsc, setSortAsc] = useState(true);

  const allTeams = useMemo(() => {
    const result: { mainName: string; team: TeamData }[] = [];
    Object.entries(teamsByName).forEach(([mainName, teams]) => {
      teams.forEach((team) => {
        result.push({ mainName, team });
      });
    });
    return result;
  }, [teamsByName]);

  const filteredAndSortedTeams = useMemo(() => {
    return allTeams
      .filter(({ mainName, team }) => {
        // Filter by elements
        if (elementsFilter.length > 0) {
          const teamElements = team.characters.map((c) =>
            c.element.toLowerCase(),
          );
          const hasMatchingElement = elementsFilter.some((element) =>
            teamElements.includes(element.toLowerCase()),
          );
          if (!hasMatchingElement) return false;
        }

        // Filter by name
        if (nameFilter) {
          const nameMatch = mainName
            .toLowerCase()
            .includes(nameFilter.toLowerCase());
          const characterMatch = team.characters.some((c) =>
            c.name?.toLowerCase().includes(nameFilter.toLowerCase()),
          );
          if (!nameMatch && !characterMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const sortOrder = sortAsc ? 1 : -1;
        switch (sortBy) {
          case "character":
            return sortOrder * a.mainName.localeCompare(b.mainName);
          case "element":
            // Sort by the main character's element
            const aElement = a.team.characters[0]?.element || "";
            const bElement = b.team.characters[0]?.element || "";
            return sortOrder * aElement.localeCompare(bElement);
          default:
            return sortOrder * a.mainName.localeCompare(b.mainName);
        }
      });
  }, [allTeams, elementsFilter, nameFilter, sortBy, sortAsc]);

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "character",
      label: t({ id: "sort_character", defaultMessage: "Character Name" }),
      icon: <LuUser className="h-4 w-4" />,
    },
    {
      value: "element",
      label: t({ id: "sort_element", defaultMessage: "Element" }),
      icon: <LuText className="h-4 w-4" />,
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
              placeholder={t({
                id: "search_teams",
                defaultMessage: "Search teams...",
              })}
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
              title={t({
                id: sortAsc ? "sort_ascending" : "sort_descending",
                defaultMessage: sortAsc ? "Sort Ascending" : "Sort Descending",
              })}
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

        {/* Mobile Filters Collapsible */}
        <Collapsible className="sm:hidden">
          <CollapsibleTrigger className="relative flex w-full items-center justify-between rounded-lg border border-input bg-card/50 p-3 text-sm font-medium text-foreground hover:bg-accent/5 active:translate-y-[1px] active:bg-accent/10">
            <div className="flex items-center gap-2">
              <span>Filters</span>
              {elementsFilter.length > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/90 px-1.5 text-xs font-medium text-accent-foreground">
                  {elementsFilter.length}
                </span>
              )}
            </div>
            <LuChevronDown className="collapsible-trigger-icon h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <div className="flex flex-col gap-2 rounded-lg border border-input bg-card/50 p-2.5">
              {/* Element Filter */}
              <div className="space-y-1.5 border-b border-input/50 pb-2.5 last:border-0 last:pb-0">
                <h3 className="text-xs font-medium text-foreground/70">
                  {t({
                    id: "element_filter",
                    defaultMessage: "Element Filter",
                  })}
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
                        {t({
                          id: element.toLowerCase(),
                          defaultMessage: element,
                        })}
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
            )}
          >
            {/* Element Filter */}
            <div className="space-y-2 last:border-0 last:pb-0 sm:space-y-3 sm:border-0 sm:pb-0">
              <h3 className="text-xs font-medium text-foreground/70 sm:text-sm">
                {t({ id: "element_filter", defaultMessage: "Element Filter" })}
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
                    <span className="truncate">
                      {t({
                        id: element.toLowerCase(),
                        defaultMessage: element,
                      })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {elementsFilter.length > 0 && (
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
                  <span className="truncate">
                    {t({ id: element.toLowerCase(), defaultMessage: element })}
                  </span>
                  <span className="ml-0.5 sm:ml-1">×</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setElementsFilter([]);
              }}
              className="text-[10px] text-muted-foreground hover:text-foreground sm:text-xs"
            >
              {t({ id: "clear_all", defaultMessage: "Clear all" })}
            </button>
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredAndSortedTeams.map(({ mainName, team }, i) => (
            <TeamCard
              key={`${mainName}-${team.name}-${i}`}
              team={team}
              mainName={mainName}
              asyncLoad={i > 4}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedTeams.length === 0 && (
          <div className="rounded-lg border border-input bg-card/50 px-4 py-8 text-center sm:px-6 sm:py-12">
            <h3 className="text-base font-medium text-foreground/80 sm:text-lg">
              {t({
                id: "no_teams_found",
                defaultMessage: "No teams found",
              })}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground sm:mt-2">
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
