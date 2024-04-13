"use client";

import { memo } from "react";

import useIntl from "@hooks/use-intl";
import type { Passive } from "@interfaces/genshin";

import Image from "./Image";

type Props = {
  characterId: string;
  passive: Passive;
};

const PassiveSkill = ({ passive, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <div className="card relative flex flex-col items-center justify-start overflow-hidden lg:w-full">
      <Image
        className="absolute top-5 w-16 opacity-10"
        alt={passive.id}
        src={`/characters/${characterId}/${passive.id}.png`}
        width={64}
        height={64}
      />
      <div className="flex flex-col items-center pb-2 text-center">
        <h4 className="text-lg font-bold text-white">{passive.name}</h4>
        <h3 className="text-sm italic">
          {passive.level > 0
            ? t({
                id: "ascension_phase_num",
                defaultMessage: "Ascension Phase {num}",
                values: { num: passive.level.toString() },
              })
            : "Passive"}
        </h3>
      </div>
      <div
        className="skill-description px-5 text-sm"
        dangerouslySetInnerHTML={{ __html: passive.description }}
      />
    </div>
  );
};

export default memo(PassiveSkill);
