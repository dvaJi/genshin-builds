"use client";

import { BuildData } from "interfaces/hsr/build";
import { useTranslations } from "next-intl";
import { memo } from "react";

import Image from "@components/hsr/Image";
import { Link } from "@i18n/navigation";
import type { LightCone, Relic } from "@interfaces/hsr";

import Stars from "./Stars";

type Props = {
  name: string;
  characterName: string;
  data: BuildData;
  lightConesMap: Record<string, LightCone>;
  relicsMap: Record<string, Relic>;
};

function CharacterBuild({
  name,
  data,
  lightConesMap,
  relicsMap,
  characterName,
}: Props) {
  const t = useTranslations("HSR.character");

  if (!lightConesMap[data.bestLightCone]) {
    console.warn(
      `Best light cone ${data.bestLightCone} not found in lightConesMap`,
    );
  }

  return (
    <div className="text-card-foreground">
      <h2 className="mb-4 text-xl font-semibold text-accent">{name}</h2>
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="flex gap-4">
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {t("best_light_cone")}
            </h3>
            <Link
              href={`/hsr/lightcones/${data.bestLightCone}`}
              className="my-1 flex items-center rounded-sm bg-muted px-2 py-1 text-sm font-semibold hover:bg-accent/20"
            >
              <Image
                src={`/lightcones/${lightConesMap[data.bestLightCone]?.id}.png`}
                width={80}
                height={80}
                alt={lightConesMap[data.bestLightCone]?.name}
              />
              <div className="ml-2">
                <div>{lightConesMap[data.bestLightCone]?.name}</div>
                <div>
                  <Stars stars={lightConesMap[data.bestLightCone]?.rarity} />
                </div>
              </div>
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {t("relics_and_ornament")}
            </h3>
            {data.relics.map((r) => (
              <Link
                key={r}
                href={`/hsr/relics/${r}`}
                className="my-1 flex items-center rounded-sm bg-muted px-2 py-1 text-sm font-semibold hover:bg-accent/20"
              >
                <Image
                  src={`/relics/${relicsMap[r].id}.png`}
                  alt={relicsMap[r].name}
                  width={48}
                  height={48}
                />
                <span className="ml-2">{relicsMap[r].name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {t("best_stats", { name: characterName })}
            </h3>
            <div className="flex flex-col text-sm">
              {Object.entries(data.mainStat ?? {}).map(([stat, value]) => (
                <div key={stat} className="my-1 rounded-sm bg-muted px-2 py-1">
                  <b className="inline">{t(stat)}</b>: {value}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent">
              {t("best_substats", { name: characterName })}
            </h3>
            <div className="flex flex-col text-sm">
              {data.subStat
                ?.sort((a, b) => b.stars - a.stars)
                ?.map((s) => (
                  <div
                    key={s.value}
                    className="my-1 flex items-center rounded-sm bg-muted px-2 py-1"
                  >
                    {s.value}
                    <span className="ml-2">
                      <Stars stars={s.stars} />
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(CharacterBuild);
