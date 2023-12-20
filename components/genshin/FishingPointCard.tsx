import type { Fish } from "@interfaces/genshin";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import FishMiniCard from "./FishMiniCard";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

import type { FishingPoint } from "interfaces/fishing";

interface FishingPointCardProps {
  city: string;
  fishingPoints: FishingPoint[];
  fish: Record<string, Fish>;
  isFishSelected: (id: string) => boolean;
}

const FishingPointCard = ({
  city,
  fishingPoints,
  fish,
  isFishSelected,
}: FishingPointCardProps) => {
  const { t } = useIntl("fishing");

  return (
    <div>
      <h2 className="mb-2 ml-4 text-3xl lg:ml-0">
        {t({ id: city, defaultMessage: city })}
      </h2>
      {fishingPoints.map((point) => (
        <div
          key={city + point.id}
          className="card flex w-full flex-col items-center p-0 lg:flex-row"
        >
          <div className="w-80 flex-grow overflow-hidden pt-5 lg:flex-grow-0 lg:pt-0">
            <LazyLoadImage
              className="w-80 transform rounded-lg transition-transform hover:scale-110 lg:rounded-r-none"
              src={getUrl(`/fishing_points/${point.id}.jpg`, 320, 320)}
              alt={point.id}
              width={320}
              height={320}
            />
          </div>
          <div className="h-full  flex-grow p-5 text-center">
            {point.fish.map((f) => (
              <FishMiniCard
                key={point.id + f}
                fish={fish[f]}
                isSelected={isFishSelected}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default memo(FishingPointCard);
