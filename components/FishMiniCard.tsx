import { IMGS_CDN } from "@lib/constants";
import { Fish } from "genshin-data";
import { memo } from "react";

interface FishMiniCardProps {
  fish: Fish;
  isSelected: (id: string) => boolean;
}

const FishMiniCard = ({ fish, isSelected }: FishMiniCardProps) => (
  <div className="inline-block">
    <div
      className="relative block m-1 bg-cover overflow-hidden text-center mb-0 rounded rounded-b-none h-24 w-24"
      style={{
        backgroundImage: `url("${IMGS_CDN}/bg_${fish.rarity}star.png")`,
        opacity: isSelected(fish.id) ? "1" : "0.3",
      }}
    >
      <img
        className="absolute bottom-1 right-1 bg-vulcan-800 rounded-full w-7"
        src={`${IMGS_CDN}/baits/${fish.bait.id}.png`}
        alt={fish.bait.name}
        title={fish.bait.name}
      />
      <img
        src={`${IMGS_CDN}/fish/${fish.id}.png`}
        alt={fish.name}
        title={fish.name}
      />
    </div>
    <span className="inline-block m-1 mt-0 overflow-hidden text-center text-xs bg-gray-900 bg-opacity-90 rounded rounded-t-none p-1 w-24">
      {fish.name}
    </span>
  </div>
);
export default memo(FishMiniCard);
