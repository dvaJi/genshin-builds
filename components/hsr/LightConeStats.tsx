"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import { Label } from "@app/components/ui/label";
import { Slider } from "@app/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@app/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@app/components/ui/tabs";
import { Link } from "@i18n/navigation";
import { LightCone, Material } from "@interfaces/hsr";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  lightcone: LightCone;
};

function LightConeStats({ lightcone }: Props) {
  const t = useTranslations("HSR.lightcone");
  const [level, setLevel] = useState(1);
  const [viewMode, setViewMode] = useState<"slider" | "table">("slider");

  const calculateStats = useCallback(
    (level: number) => {
      const ascension = lightcone.ascend.find(
        (a) => level >= (a.levelReq || 1) && level <= a.maxLevel,
      );

      if (!ascension) return null;

      const levelsAboveBase = level - (ascension.levelReq || 1);
      return {
        hp: Math.round(ascension.hpBase + ascension.hpAdd * levelsAboveBase),
        atk: Math.round(
          ascension.attackBase + ascension.attackAdd * levelsAboveBase,
        ),
        def: Math.round(
          ascension.defenseBase + ascension.defenseAdd * levelsAboveBase,
        ),
      };
    },
    [lightcone.ascend],
  );
  const currentStats = useMemo(
    () => calculateStats(level),
    [calculateStats, level],
  );

  const slideAscension = useMemo(() => {
    return Object.values(
      lightcone.ascend
        .filter((a) => level >= a.maxLevel)
        .flatMap((a) => a.materials)
        .reduce(
          (acc, mat) => {
            if (!acc[mat.id]) {
              acc[mat.id] = { ...mat };
            } else {
              acc[mat.id].amount += mat.amount;
            }
            return acc;
          },
          {} as Record<string, Material>,
        ),
    );
  }, [lightcone.ascend, level]);

  const ascensionMaterials = useMemo(() => {
    return lightcone.ascend.map((ascension) => ({
      level: ascension.levelReq || 1,
      maxLevel: ascension.maxLevel,
      materials: ascension.materials || [],
    }));
  }, [lightcone.ascend]);

  return (
    <div className="">
      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "slider" | "table")}
      >
        <TabsList>
          <TabsTrigger value="slider">{t("slider_view")}</TabsTrigger>
          <TabsTrigger value="table">{t("table_view")}</TabsTrigger>
        </TabsList>

        <TabsContent value="slider" className="mt-4">
          <div className="mb-4">
            <Label>
              {t("level")}: {level}
            </Label>
            <Slider
              value={[level]}
              onValueChange={(v) => setLevel(v[0])}
              min={1}
              max={80}
              step={1}
              className="my-2"
            />
          </div>

          {currentStats && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded border border-border bg-background p-4">
                <div className="text-sm text-muted-foreground">{t("hp")}</div>
                <div className="text-lg font-semibold text-card-foreground">
                  {currentStats.hp.toLocaleString()}
                </div>
              </div>
              <div className="rounded border border-border bg-background p-4">
                <div className="text-sm text-muted-foreground">{t("atk")}</div>
                <div className="text-lg font-semibold text-card-foreground">
                  {currentStats.atk.toLocaleString()}
                </div>
              </div>
              <div className="rounded border border-border bg-background p-4">
                <div className="text-sm text-muted-foreground">{t("def")}</div>
                <div className="text-lg font-semibold text-card-foreground">
                  {currentStats.def.toLocaleString()}
                </div>
              </div>
            </div>
          )}
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-accent">
              {t("ascension_materials")}
            </h3>
            <div className="rounded border border-border bg-background p-4">
              <div className="flex flex-wrap gap-2">
                {slideAscension.map((material) => (
                  <Link
                    href={`/hsr/item/${material.id}`}
                    key={material.id + "slider"}
                    className="flex items-center rounded bg-muted p-2 text-card-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    <img
                      src={getHsrUrl(`/items/${material.id}.png`)}
                      alt={material.name}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {material.name} ×{material.amount}
                    </span>
                  </Link>
                ))}
              </div>
              {slideAscension.length === 0 && (
                <div className="text-muted-foreground">
                  {t("ascension_materials_none")}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table" className="mt-4">
          <div className="overflow-x-auto">
            <Table className="rounded-md border">
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 z-10">
                    {t("stats")}
                  </TableHead>
                  {lightcone.ascend.map((ascension) => (
                    <TableHead
                      key={ascension.promotion}
                      colSpan={2}
                      className="text-center"
                    >
                      {t("level")} {ascension.levelReq || 1}-
                      {ascension.maxLevel}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border">
                  <TableCell>{t("hp")}</TableCell>
                  {lightcone.ascend.map((ascension) => {
                    const baseStats = calculateStats(ascension.levelReq || 1);
                    const maxStats = calculateStats(ascension.maxLevel);
                    return (
                      <TableCell
                        key={ascension.promotion}
                        className="text-center"
                        colSpan={2}
                      >
                        <span className="text-card-foreground">
                          {baseStats?.hp.toLocaleString()}
                        </span>
                        <span className="mx-1 text-muted-foreground">→</span>
                        <span className="text-card-foreground">
                          {maxStats?.hp.toLocaleString()}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell>{t("atk")}</TableCell>
                  {lightcone.ascend.map((ascension) => {
                    const baseStats = calculateStats(ascension.levelReq || 1);
                    const maxStats = calculateStats(ascension.maxLevel);
                    return (
                      <TableCell
                        key={ascension.promotion}
                        className="text-center"
                        colSpan={2}
                      >
                        <span className="text-card-foreground">
                          {baseStats?.atk.toLocaleString()}
                        </span>
                        <span className="mx-1 text-muted-foreground">→</span>
                        <span className="text-card-foreground">
                          {maxStats?.atk.toLocaleString()}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell>{t("def")}</TableCell>
                  {lightcone.ascend.map((ascension) => {
                    const baseStats = calculateStats(ascension.levelReq || 1);
                    const maxStats = calculateStats(ascension.maxLevel);
                    return (
                      <TableCell
                        key={ascension.promotion}
                        className="text-center"
                        colSpan={2}
                      >
                        <span className="text-card-foreground">
                          {baseStats?.def.toLocaleString()}
                        </span>
                        <span className="mx-1 text-muted-foreground">→</span>
                        <span className="text-card-foreground">
                          {maxStats?.def.toLocaleString()}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="mt-6">
            <h4 className="mb-2 text-base font-semibold text-card-foreground">
              {t("total_ascension_materials_required")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(
                ascensionMaterials
                  .flatMap((a) => a.materials)
                  .reduce(
                    (acc, mat) => {
                      if (!acc[mat.id]) {
                        acc[mat.id] = { ...mat };
                      } else {
                        acc[mat.id].amount += mat.amount;
                      }
                      return acc;
                    },
                    {} as Record<string, Material>,
                  ),
              ).map((material) => (
                <Link
                  href={`/hsr/item/${material.id}`}
                  key={material.id}
                  className="flex items-center rounded bg-muted p-2 text-card-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <img
                    src={getHsrUrl(`/items/${material.id}.png`)}
                    alt={material.name}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {material.name} ×{material.amount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LightConeStats;
