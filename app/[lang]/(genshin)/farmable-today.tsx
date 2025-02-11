"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import SimpleRarityBox from "@components/SimpleRarityBox";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
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
  const { t, locale } = useIntl("ascension_planner");
  const currentDayIndex = new Date().getDay();
  const adjustedDayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
  const [currentDay, setCurrentDay] = useState(days[adjustedDayIndex]);

  return (
    <>
      {/* Day Selection */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {days.map((day) => (
          <Button
            key={day}
            variant={currentDay === day ? "primary" : "secondary"}
            size="sm"
            className={clsx(
              "min-w-[100px] transform transition-all duration-300",
              currentDay === day && "shadow-primary/20 scale-105 shadow-lg"
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

      <div className="space-y-6">
        {/* Section Header */}
        <div>
          <h2 className="text-foreground text-2xl font-semibold">
            {t({
              id: "farmable_today",
              defaultMessage: "Farmable today",
            })}
          </h2>
          <p className="text-muted-foreground">
            {t({
              id: "farmable_today_desc",
              defaultMessage:
                "Discover which characters and weapons are farmable today.",
            })}
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {/* Character Domains */}
          {domains.characters.map((charactersDomain) => (
            <div
              key={charactersDomain.domainName}
              className="card overflow-hidden"
            >
              <h3 className="text-card-foreground mb-4 text-lg font-medium">
                {charactersDomain.domainName}
              </h3>
              <div className="flex flex-wrap gap-3">
                {charactersDomain.rotation
                  .find((r) => r.day === currentDay)
                  ?.ids.map((cId) => (
                    <Link
                      key={cId}
                      href={`/${locale}/character/${cId}`}
                      prefetch={false}
                    >
                      <SimpleRarityBox
                        img={getUrl(`/characters/${cId}/image.png`, 80, 80)}
                        rarity={characters[cId].rarity}
                        alt={characters[cId].name}
                        name={characters[cId].name}
                        className="h-20 w-20 rounded-lg shadow-md"
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
              className="card overflow-hidden"
            >
              <h3 className="text-card-foreground mb-4 text-lg font-medium">
                {weaponsDomain.domainName}
              </h3>
              <div className="flex flex-wrap gap-3">
                {weaponsDomain.rotation
                  .find((r) => r.day === currentDay)
                  ?.ids.map((cId) =>
                    weapons[cId] ? (
                      <Link
                        key={cId}
                        href={`/${locale}/weapon/${cId}`}
                        prefetch={false}
                      >
                        <SimpleRarityBox
                          img={getUrl(`/weapons/${cId}.png`, 80, 80)}
                          rarity={weapons[cId].rarity}
                          alt={weapons[cId].name}
                          name={weapons[cId].name}
                          className="h-20 w-20 rounded-lg shadow-md"
                        />
                      </Link>
                    ) : (
                      <div
                        key={cId}
                        className="bg-destructive/10 text-destructive-foreground rounded px-2 py-1 text-xs"
                      >
                        NOT FOUND {cId}
                      </div>
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
