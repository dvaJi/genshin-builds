import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Constellation } from "genshin-data/dist/types/character";

import { getUrl } from "@lib/imgUrl";
import Card from "./ui/Card";

type Props = {
  characterId: string;
  constellation: Constellation;
};

const ConstellationCard = ({ constellation, characterId }: Props) => {
  return (
    <div className="flex justify-center lg:block">
      <Card className="flex flex-col relative justify-start overflow-hidden w-11/12 lg:w-full">
        <div className="flex flex-col">
          <div className="absolute top-0 pointer-events-none left-0 right-0 bottom-0 flex items-start justify-center overflow-hidden z-0 h-96">
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
        <div className="flex z-10 items-center text-center p-5 mb-2">
          <div className="flex flex-col flex-grow">
            <div className="font-bold text-lg text-white">
              {constellation.name}
            </div>
            <div className="text-sm">
              Constellation Lv. {constellation.level}
            </div>
          </div>
        </div>
        <div
          className="px-5 text-sm z-10 skill-description mb-4"
          dangerouslySetInnerHTML={{ __html: constellation.description }}
        />
      </Card>
    </div>
  );
};

export default memo(ConstellationCard);
