"use client";

import type { Passive } from "@interfaces/genshin/dist/types/character";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useIntl from "@hooks/use-intl";
import { getUrlLQ } from "@lib/imgUrl";

type Props = {
  characterId: string;
  passive: Passive;
};

const PassiveSkill = ({ passive, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <div className="card relative flex flex-col items-center justify-start overflow-hidden lg:w-full">
      <LazyLoadImage
        className="absolute top-5 w-16 opacity-10"
        alt={passive.id}
        src={getUrlLQ(`/characters/${characterId}/${passive.id}.png`, 76, 76)}
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
