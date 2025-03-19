"use client";

import { Relics } from "interfaces/hsr/build";
import { useTranslations } from "next-intl";
import { memo } from "react";

import Image from "@components/hsr/Image";
import { Link } from "@i18n/navigation";
import type { LightCone, Relic } from "@interfaces/hsr";

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
  const t = useTranslations("HSR.character");

  return (
    <div className="flex flex-col gap-4 text-card-foreground md:flex-row">
      <div>
        <h2 className="text-lg font-semibold text-accent">
          {t("best_relics", { name: characterName })}
        </h2>
        {relics.set.map((r) => (
          <div
            key={r.ids.join("-")}
            className="mb-2 mt-1 flex flex-col rounded-sm bg-muted px-2 py-1 text-sm font-semibold"
          >
            {r.ids.map((id) => (
              <Link
                href={`/hsr/relics/${id}`}
                key={id}
                className="flex items-center hover:text-accent/80"
              >
                <div className="mr-2 rounded bg-card p-2">{r.amount}</div>
                <Image
                  src={`/relics/${id}.png`}
                  alt={relicsMap[id].name}
                  width={48}
                  height={48}
                />
                <span className="ml-2">{relicsMap[id].name}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-accent">
          {t("best_ornaments", { name: characterName })}
        </h3>
        {relics.ornament.map((r) => (
          <Link
            key={r}
            href={`/hsr/relics/${r}`}
            className="mb-2 mt-1 flex items-center rounded-sm bg-muted px-2 py-1 text-sm font-semibold hover:text-accent/80"
          >
            <Image
              src={`/relics/${r}.png`}
              alt={relicsMap[r].name}
              width={48}
              height={48}
            />
            <span className="ml-2">{relicsMap[r].name}</span>
          </Link>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-accent">
          {t("best_lightcones", { name: characterName })}
        </h3>
        {lightcones.map((r) => (
          <Link
            key={r}
            href={`/hsr/lightcones/${r}`}
            className="mb-2 mt-1 flex items-center rounded-sm bg-muted px-2 py-1 text-sm font-semibold hover:text-accent/80"
          >
            <Image
              src={`/lightcones/${r}.png`}
              alt={lightConesMap[r].name}
              width={32}
              height={32}
            />
            <span className="ml-2">{lightConesMap[r].name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default memo(CharacterBestEquip);
