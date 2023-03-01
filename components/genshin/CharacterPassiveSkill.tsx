import { memo } from "react";
import { Passive } from "genshin-data/dist/types/character";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Card from "../ui/Card";
import { getUrl } from "@lib/imgUrl";
import useIntl from "@hooks/use-intl";

type Props = {
  characterId: string;
  passive: Passive;
};

const PassiveSkill = ({ passive, characterId }: Props) => {
  const { t } = useIntl("character");
  return (
    <div className="flex justify-center lg:block">
      <Card className="relative flex w-11/12 flex-col justify-start overflow-hidden lg:w-full">
        <div className="flex flex-col">
          <div className="pointer-events-none absolute top-4 left-0 right-0 bottom-0 z-0 flex h-96 items-start justify-center overflow-hidden">
            <LazyLoadImage
              className="w-16 opacity-20"
              alt={passive.id}
              src={getUrl(
                `/characters/${characterId}/${passive.id}.png`,
                76,
                76
              )}
            />
          </div>
        </div>
        <div className="flex items-center p-5 text-center">
          <div className="flex flex-grow flex-col">
            <div className="text-lg font-bold text-white">{passive.name}</div>
            {passive.level > 0 && (
              <div className="text-sm">
                {t({
                  id: "ascension_phase_num",
                  defaultMessage: "Ascension Phase {num}",
                  values: { num: passive.level.toString() },
                })}
              </div>
            )}
          </div>
        </div>
        <div
          className="skill-description mb-5 px-5 text-sm"
          dangerouslySetInnerHTML={{ __html: passive.description }}
        />
      </Card>
    </div>
  );
};

export default memo(PassiveSkill);
