"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

import { Badge } from "@app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@app/components/ui/card";
import { cn } from "@app/lib/utils";
import { ElementBadge } from "@components/genshin/ElementBadge";
import Image from "@components/genshin/Image";
import useIntl from "@hooks/use-intl";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import type { CharacterTeam } from "@interfaces/teams";

type Props = {
  locale: string;
  characterTeam: CharacterTeam;
  character: Character;
  artifactsMap: Record<string, Artifact>;
  weaponsMap: Record<string, Weapon>;
};

export function CharacterCard({
  locale,
  characterTeam,
  character,
  artifactsMap,
  weaponsMap,
}: Props) {
  const { t } = useIntl("teams");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/characters/${characterTeam.id}`}>
            <div
              className={cn(
                "relative h-20 w-20 rounded-md",
                `genshin-bg-rarity-${character.rarity}`,
              )}
            >
              <Image
                src={`/characters/${characterTeam.id}/image.png`}
                alt={`${character.name} portrait`}
                fill
                className="object-cover"
              />
            </div>
          </Link>
          <div>
            <CardTitle className="text-xl">
              <Link
                className="hover:underline"
                href={`/${locale}/teams/${characterTeam.id}`}
              >
                {character.name}
              </Link>
            </CardTitle>
            <div className="mt-1 flex gap-2">
              <Badge variant="outline" className="text-xs">
                {characterTeam.role}
              </Badge>
              <ElementBadge element={character.element} />
              {characterTeam.c_min > 0 ? (
                <Badge variant="outline" className="text-xs">
                  {t("constellation_num", {
                    num: characterTeam.c_min.toString(),
                  })}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p
          className="text-sm text-slate-400"
          dangerouslySetInnerHTML={{ __html: characterTeam.description ?? "" }}
        />

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-300">
              {t("artifacts")}
            </h3>
            <div className="mb-2 text-sm text-accent">
              {characterTeam.artifacts.map((artifact) => (
                <Fragment key={artifact}>
                  <Tooltip
                    id={artifact}
                    className="max-w-96 !border !bg-card shadow-md"
                    place="left"
                  >
                    <div className="flex gap-2">
                      <div
                        className={`rounded-md genshin-bg-rarity-${artifactsMap[artifact].max_rarity}`}
                      >
                        <Image
                          src={`/artifacts/${artifact}.png`}
                          height={48}
                          width={48}
                          className="object-cover"
                          alt={artifactsMap[artifact].name}
                        />
                      </div>
                      <div className="text-lg font-semibold">
                        {artifactsMap[artifact].name}
                      </div>
                    </div>
                    <div className="border-b py-2">
                      <span className="mr-2 rounded bg-accent-foreground p-1 text-xs">
                        2
                      </span>
                      {artifactsMap[artifact]["two_pc"]}
                    </div>
                    <div className="py-2">
                      <span className="mr-2 rounded bg-accent-foreground p-1 text-xs">
                        4
                      </span>
                      {artifactsMap[artifact]["four_pc"]}
                    </div>
                  </Tooltip>
                  <Link
                    href={`/${locale}/artifacts/${artifact}`}
                    className="hover:text-primary"
                    data-tooltip-id={artifact}
                  >
                    <Image
                      src={`/artifacts/${artifact}.png`}
                      height={24}
                      width={24}
                      className="mr-2 inline-block h-6"
                      alt={artifactsMap[artifact].name}
                    />
                    {artifactsMap[artifact].name}
                  </Link>
                </Fragment>
              ))}
            </div>
            <div className="space-y-2">
              <div>
                <h4 className="text-xs text-slate-500">{t("main_stats")}</h4>
                <ul className="list-inside list-disc text-sm">
                  <li>
                    {t("sands")} {characterTeam.main_stats.sand.join(" / ")}
                  </li>
                  <li>
                    {t("goblet")} {characterTeam.main_stats.globet.join(" / ")}
                  </li>
                  <li>
                    {t("circlet")}{" "}
                    {characterTeam.main_stats.circlet.join(" / ")}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs text-slate-500">{t("substats")}</h4>
                <p className="text-sm">
                  {characterTeam.sub_stats.map((st) => t(st)).join(" / ")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-slate-300">
              {t("weapons")}
            </h3>
            <ul className="space-y-1">
              {characterTeam.weapons.map((weapon, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-accent"
                >
                  <Tooltip
                    id={weapon}
                    className="max-w-96 !border !bg-card shadow-md"
                    place="left"
                  >
                    <div className="flex gap-2">
                      <div
                        className={`rounded-md genshin-bg-rarity-${weaponsMap[weapon].rarity}`}
                      >
                        <Image
                          src={`/weapons/${weapon}.png`}
                          height={48}
                          width={48}
                          className="object-cover"
                          alt={weaponsMap[weapon].name}
                        />
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {weaponsMap[weapon].name}
                        </div>
                        <div className="font-semibold text-primary">
                          {weaponsMap[weapon].passive} -{" "}
                          {weaponsMap[weapon].stats.secondary}
                        </div>
                      </div>
                    </div>

                    <div
                      className="py-2"
                      dangerouslySetInnerHTML={{
                        __html: weaponsMap[weapon].bonus,
                      }}
                    />
                  </Tooltip>
                  <Link
                    href={`/${locale}/weapon/${weapon}`}
                    className="hover:text-primary"
                    data-tooltip-id={weapon}
                  >
                    <Image
                      src={`/weapons/${weapon}.png`}
                      height={24}
                      width={24}
                      className="mr-2 inline-block h-6"
                      alt={weaponsMap[weapon].name}
                    />
                    {weaponsMap[weapon].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
