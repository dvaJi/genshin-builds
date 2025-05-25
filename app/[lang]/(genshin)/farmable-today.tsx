"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";

import SimpleRarityBox from "@components/SimpleRarityBox";
import Button from "@components/ui/Button";
import { Link } from "@i18n/navigation";
import type { Character, Domains, Weapon } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";

type Props = {
  days: string[];
  domains: Domains;
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
};

export default function FarmableToday({
  days,
  domains,
  characters,
  weapons,
}: Props) {
  const t = useTranslations("Genshin.ascension_planner");
  const currentDayIndex = new Date().getDay();
  const adjustedDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
  const [currentDay, setCurrentDay] = useState(days[adjustedDayIndex]);

  return (
    <>
      {/* Day Selection - More compact on mobile */}
      <div className="mb-4 flex flex-wrap justify-center gap-1.5 sm:mb-6 sm:gap-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={currentDay === day ? "primary" : "secondary"}
            size="sm"
            className={clsx(
              "min-w-[90px] transform text-sm transition-all duration-300 sm:min-w-[100px]",
              currentDay === day && "scale-105 shadow-lg shadow-primary/20",
            )}
            onClick={() => {
              trackClick(`planner_day`);
              setCurrentDay(day);
            }}
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Section Header - Reduced spacing on mobile */}
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            {t("farmable_today")}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t("farmable_today_desc")}
          </p>
        </div>

        {/* Domains Grid - Optimized for mobile */}
        <div className="grid gap-3 sm:grid-cols-1 sm:gap-4 lg:grid-cols-2">
          {/* Character Domains */}
          {domains.characters.map((charactersDomain) => (
            <div
              key={charactersDomain.domainName}
              className="card overflow-hidden p-3 sm:p-4"
            >
              <h3 className="mb-2 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg">
                {charactersDomain.domainName}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {charactersDomain.rotation
                  .find((r) => r.day === currentDay)
                  ?.ids.map((cId) => (
                    <Link key={cId} href={`/character/${cId}`}>
                      <SimpleRarityBox
                        img={getUrl(`/characters/${cId}/image.png`, 64, 64)}
                        rarity={characters[cId].rarity}
                        alt={characters[cId].name}
                        name={characters[cId].name}
                        hideNameOnMobile
                        className="h-16 w-16 rounded-lg shadow-md sm:h-20 sm:w-20"
                      />
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          {/* Weapon Domains */}
          {domains.weapons.map((weaponsDomain) => (
            <div
              key={weaponsDomain.domainName}
              className="card overflow-hidden p-3 sm:p-4"
            >
              <h3 className="mb-2 text-base font-medium text-card-foreground sm:mb-4 sm:text-lg">
                {weaponsDomain.domainName}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {weaponsDomain.rotation
                  .find((r) => r.day === currentDay)
                  ?.ids.map((cId) =>
                    weapons[cId] ? (
                      <Link
                        key={weaponsDomain.domainName + cId}
                        href={`/weapon/${cId}`}
                      >
                        <SimpleRarityBox
                          img={getUrl(`/weapons/${cId}.png`, 64, 64)}
                          rarity={weapons[cId].rarity}
                          alt={weapons[cId].name}
                          name={weapons[cId].name}
                          hideNameOnMobile
                          className="h-14 w-14 rounded-lg shadow-md sm:w-20 md:h-20"
                        />
                      </Link>
                    ) : (
                      <div
                        key={cId}
                        className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive-foreground"
                      >
                        NOT FOUND {cId}
                      </div>
                    ),
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
