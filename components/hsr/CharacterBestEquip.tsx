'use client';

import useIntl from "@hooks/use-intl";
import { getHsrUrl } from "@lib/imgUrl";
import { LightCone, Relic } from "hsr-data";
import { Relics } from "interfaces/hsr/build";
import { memo } from "react";

type Props = {
  characterName: string;
  relics: Relics;
  lightcones: string[];
  lightConesMap: Record<string, LightCone>;
  relicsMap: Record<string, Relic>;
};
function CharacterBestEquip({
  characterName,
  relics,
  lightcones,
  lightConesMap,
  relicsMap,
}: Props) {
  const { t } = useIntl("character");

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div>
        <h3 className="text-slate-300">
          {t({
            id: "best_relics",
            defaultMessage: "{name} Best Relics",
            values: { name: characterName },
          })}
        </h3>
        {relics.set.map((r) => (
          <div
            key={r.ids.join("-")}
            className="mb-2 mt-1 flex flex-col rounded-sm bg-hsr-surface2 px-2 py-1 text-sm font-semibold"
          >
            {r.ids.map((id) => (
              <div key={id} className="flex items-center">
                <div className="mr-2 rounded bg-hsr-surface3 p-2">
                  {r.amount}
                </div>
                <img
                  src={getHsrUrl(`/relics/${id}.png`, 64, 64)}
                  alt={relicsMap[id].name}
                  width={48}
                  height={48}
                />
                <span className="ml-2">{relicsMap[id].name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-slate-300">
          {t({
            id: "best_ornaments",
            defaultMessage: "{name} Best Ornaments",
            values: { name: characterName },
          })}
        </h3>
        {relics.ornament.map((r) => (
          <div
            key={r}
            className="mb-2 mt-1 flex items-center rounded-sm bg-hsr-surface2 px-2 py-1 text-sm font-semibold"
          >
            <img
              src={getHsrUrl(`/relics/${r}.png`, 64, 64)}
              alt={relicsMap[r].name}
              width={48}
              height={48}
            />
            <span className="ml-2">{relicsMap[r].name}</span>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-slate-300">
          {t({
            id: "best_lightcones",
            defaultMessage: "{name} Best Light Cones",
            values: { name: characterName },
          })}
        </h3>
        {lightcones.map((r) => (
          <div
            key={r}
            className="mb-2 mt-1 flex items-center rounded-sm bg-hsr-surface2 px-2 py-1 text-sm font-semibold"
          >
            <img
              src={getHsrUrl(`/lightcones/${r}.png`, 50, 50)}
              alt={lightConesMap[r].name}
              width={32}
              height={32}
            />
            <span className="ml-2">{lightConesMap[r].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CharacterBestEquip);
