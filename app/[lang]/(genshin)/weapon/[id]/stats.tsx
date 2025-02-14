"use client";

import { useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

import { Button } from "@app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import useIntl from "@hooks/use-intl";
import type { Weapon } from "@interfaces/genshin";

type Props = {
  weapon: Weapon;
};

export default function WeaponStats({ weapon }: Props) {
  const { t } = useIntl("weapon");
  const [refinement, setRefinement] = useState(0);
  const [weaponStatIndex, setWeaponStatIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-0">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-2xl font-bold">
            {t({ id: "stats", defaultMessage: "Stats" })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={weaponStatIndex === 0}
              onClick={() => setWeaponStatIndex(weaponStatIndex - 1)}
            >
              <LuMinus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={weaponStatIndex === weapon.stats.levels.length - 1}
              onClick={() => setWeaponStatIndex(weaponStatIndex + 1)}
            >
              <LuPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-lg font-medium">
                {t({ id: "base_atk", defaultMessage: "Base ATK" })}
                <span className="ml-2 text-xl text-primary">
                  {weapon.stats.levels[weaponStatIndex]?.primary}
                </span>
              </div>
              {weapon.stats.secondary && (
                <div className="text-lg font-medium">
                  {weapon.stats.secondary}
                  <span className="ml-2 text-xl text-primary">
                    {weapon.stats.levels[weaponStatIndex]?.secondary}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium">
                {t({ id: "level", defaultMessage: "Level" })}
                <span className="ml-2 text-xl text-primary">
                  {weapon.stats.levels[weaponStatIndex]?.level}
                </span>
              </div>
              <div className="text-lg font-medium">
                {t({ id: "ascension", defaultMessage: "Ascension" })}
                <span className="ml-2 text-xl text-primary">
                  {weapon.stats.levels[weaponStatIndex]?.ascension}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-2xl font-bold">
            {t({ id: "refinement", defaultMessage: "Refinement" })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={refinement === 0}
              onClick={() => setRefinement(refinement - 1)}
            >
              <LuMinus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={refinement === weapon.refinements.length - 1}
              onClick={() => setRefinement(refinement + 1)}
            >
              <LuPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="rounded-lg border border-muted-foreground/20 bg-card p-4">
            <div
              className="prose-sm prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: weapon.refinements[refinement]?.desc,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
