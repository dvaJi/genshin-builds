"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import type { Constellation } from "@interfaces/genshin/character";

import Image from "./Image";

type Props = {
  characterId: string;
  passive: Constellation;
};

const PassiveSkill = ({ passive, characterId }: Props) => {
  const t = useTranslations("Genshin.character");
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
            ? t("ascension_phase_num", { num: passive.level.toString() })
            : t("passive")}
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
