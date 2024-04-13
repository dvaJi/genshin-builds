"use client";

import { memo } from "react";

import useIntl from "@hooks/use-intl";
import type { Constellation } from "@interfaces/genshin";

import Image from "./Image";

type Props = {
  characterId: string;
  constellation: Constellation;
};

const ConstellationCard = ({ constellation, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <div className="card relative flex flex-col items-center justify-start overflow-hidden lg:w-full">
      <Image
        className="absolute top-5 w-16 opacity-10"
        alt={constellation.id}
        src={`/characters/${characterId}/${constellation.id.replace(
          "normal_attack_",
          "",
        )}_w.png`}
        width={64}
        height={64}
      />
      <div className="flex flex-col items-center pb-2 text-center">
        <h4 className="text-lg font-bold text-white">{constellation.name}</h4>
        <h3 className="text-sm italic">
          {t({
            id: "constellation_lvl",
            defaultMessage: "Constellation Lv. {level}",
            values: { level: constellation.level.toString() },
          })}
        </h3>
      </div>
      <div
        className="skill-description z-10 px-5 text-sm"
        dangerouslySetInnerHTML={{ __html: constellation.description }}
      />
    </div>
  );
};

export default memo(ConstellationCard);
