import useIntl from "@hooks/use-intl";
import { IMGS_CDN } from "@lib/constants";
import { Fish } from "genshin-data";
import { FishingPoint } from "interfaces/fishing";
import { memo } from "react";
import FishMiniCard from "./FishMiniCard";

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
  const { t } = useIntl();

  return (
    <div>
      <h2 className="text-3xl mb-2 ml-4 lg:ml-0">
        {t({ id: city, defaultMessage: city })}
      </h2>
      {fishingPoints.map((point) => (
        <div
          key={city + point.id}
          className="border border-vulcan-900 bg-vulcan-800 rounded-lg mb-4 flex flex-col lg:flex-row items-center w-full"
        >
          <div className="flex-grow lg:flex-grow-0 overflow-hidden w-80 pt-5 lg:pt-0">
            <img
              className="w-80 rounded-lg lg:rounded-r-none transition-transform transform hover:scale-110"
              src={`${IMGS_CDN}/fishing_points/${point.id}.jpg`}
              alt={point.id}
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
        </div>
      ))}
    </div>
  );
};
export default memo(FishingPointCard);
