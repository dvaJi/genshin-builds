'use client';

import { Constellation } from "genshin-data/dist/types/character";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import Card from "../ui/Card";

type Props = {
  characterId: string;
  constellation: Constellation;
};

const ConstellationCard = ({ constellation, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <Card className="relative flex flex-col items-center justify-start overflow-hidden lg:w-full">
      <LazyLoadImage
        className="absolute top-5 w-16 opacity-10"
        alt={constellation.id}
        src={getUrl(
          `/characters/${characterId}/${constellation.id.replace(
            "normal_attack_",
            ""
          )}_w.png`,
          76,
          76
        )}
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
    </Card>
  );
};

export default memo(ConstellationCard);
