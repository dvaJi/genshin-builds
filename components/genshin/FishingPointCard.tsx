import { memo } from "react";
import { Fish } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import FishMiniCard from "./FishMiniCard";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

import { FishingPoint } from "interfaces/fishing";
import Card from "../ui/Card";

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
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({ id: city, defaultMessage: city })}
      </h2>
      {fishingPoints.map((point) => (
        <Card
          key={city + point.id}
          className="p-0 flex flex-col lg:flex-row items-center w-full"
        >
          <div className="flex-grow lg:flex-grow-0 overflow-hidden w-80 pt-5 lg:pt-0">
            <LazyLoadImage
              className="w-80 rounded-lg lg:rounded-r-none transition-transform transform hover:scale-110"
              src={getUrl(`/fishing_points/${point.id}.jpg`, 320, 320)}
              alt={point.id}
              width={320}
              height={320}
            />
          </div>
          <div className="flex-grow  text-center h-full p-5">
            {point.fish.map((f) => (
              <FishMiniCard
                key={point.id + f}
                fish={fish[f]}
                isSelected={isFishSelected}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
export default memo(FishingPointCard);
