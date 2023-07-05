import { LightCone, Relic } from "hsr-data";
import { memo } from "react";

import Stars from "./Stars";

import useIntl from "@hooks/use-intl";
import { getHsrUrl } from "@lib/imgUrl";
import { BuildData } from "interfaces/hsr/build";

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
  const { t } = useIntl("character");

  return (
    <div>
      <h2 className="font-semibold text-slate-200">
        {t({
          id: name,
          defaultMessage: name,
        })}
      </h2>
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <div className="flex gap-4">
          <div>
            <h3 className="text-slate-300">
              {t({
                id: "best_light_cone",
                defaultMessage: "Best Light Cone",
              })}
            </h3>
            <div className="my-1 flex items-center rounded-sm bg-hsr-surface2 px-2 py-1 text-sm font-semibold">
              <img
                src={getHsrUrl(
                  `/lightcones/${lightConesMap[data.bestLightCone].id}.png`,
                  80,
                  80
                )}
                width={80}
                height={80}
                alt={lightConesMap[data.bestLightCone].name}
              />
              <div className="ml-2">
                <div>{lightConesMap[data.bestLightCone].name}</div>
                <div>
                  <Stars stars={lightConesMap[data.bestLightCone].rarity} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-slate-300">
              {t({
                id: "relics_and_ornament",
                defaultMessage: "Relics and Ornaments",
              })}
            </h3>
            {data.relics.map((r) => (
              <div
                key={r}
                className="my-1 flex items-center rounded-sm bg-hsr-surface2 px-2 py-1 text-sm font-semibold"
              >
                <img
                  src={getHsrUrl(`/relics/${relicsMap[r].id}.png`, 64, 64)}
                  alt={relicsMap[r].name}
                  width={48}
                  height={48}
                />
                <span className="ml-2">{relicsMap[r].name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <h3 className="text-slate-300">
              {t({
                id: "best_stats",
                defaultMessage: "{name} Best Stats",
                values: { name: characterName },
              })}
            </h3>
            <div className="flex flex-col text-sm">
              {Object.entries(data.mainStat ?? {}).map(([stat, value]) => (
                <div
                  key={stat}
                  className="my-1 rounded-sm bg-hsr-surface2 px-2 py-1"
                >
                  <b className="inline">
                    {t({
                      id: stat,
                      defaultMessage: stat,
                    })}
                  </b>
                  : {value}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-slate-300">
              {t({
                id: "best_substats",
                defaultMessage: "{name} Best Substats",
                values: { name: characterName },
              })}
            </h3>
            <div className="flex flex-col text-sm">
              {data.subStat
                ?.sort((a, b) => b.stars - a.stars)
                ?.map((s) => (
                  <div
                    key={s.value}
                    className="my-1 flex items-center rounded-sm bg-hsr-surface2 px-2 py-1"
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
