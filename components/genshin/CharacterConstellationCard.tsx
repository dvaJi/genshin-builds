import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Constellation } from "genshin-data/dist/types/character";

import { getUrl } from "@lib/imgUrl";
import Card from "../ui/Card";
import useIntl from "@hooks/use-intl";

type Props = {
  characterId: string;
  constellation: Constellation;
};

const ConstellationCard = ({ constellation, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <div className="flex justify-center lg:block">
      <Card className="relative flex w-11/12 flex-col justify-start overflow-hidden lg:w-full">
        <div className="flex flex-col">
          <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-0 flex h-96 items-start justify-center overflow-hidden">
            <LazyLoadImage
              className="w-24 opacity-20"
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
          </div>
        </div>
        <div className="z-10 mb-2 flex items-center p-5 text-center">
          <div className="flex flex-grow flex-col">
            <div className="text-lg font-bold text-white">
              {constellation.name}
            </div>
            <div className="text-sm">
              {t({
                id: "constellation_lvl",
                defaultMessage: "Constellation Lv. {level}",
                values: { level: constellation.level.toString() },
              })}
            </div>
          </div>
        </div>
        <div
          className="skill-description z-10 mb-4 px-5 text-sm"
          dangerouslySetInnerHTML={{ __html: constellation.description }}
        />
      </Card>
    </div>
  );
};

export default memo(ConstellationCard);
