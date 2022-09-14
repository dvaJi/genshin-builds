import { memo } from "react";
import { Fish } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getUrl } from "@lib/imgUrl";

interface FishMiniCardProps {
  fish: Fish;
  isSelected: (id: string) => boolean;
}

const FishMiniCard = ({ fish, isSelected }: FishMiniCardProps) => (
  <div className="inline-block">
    <div
      className="relative block m-1 bg-cover overflow-hidden text-center mb-0 rounded rounded-b-none h-24 w-24"
      style={{
        backgroundImage: `url("${getUrl(`/bg_${fish.rarity}star.png`)}")`,
        opacity: isSelected(fish.id) ? "1" : "0.3",
      }}
    >
      <LazyLoadImage
        className="absolute bottom-1 right-1 bg-vulcan-800 rounded-full w-7"
        src={getUrl(`/baits/${fish.bait.id}.png`, 28, 28)}
        alt={fish.bait.name}
        title={fish.bait.name}
        width={28}
        height={28}
      />
      <LazyLoadImage
        src={getUrl(`/fish/${fish.id}.png`, 96, 96)}
        alt={fish.name}
        title={fish.name}
        width={96}
        height={96}
      />
    </div>
    <span className="inline-block m-1 mt-0 overflow-hidden text-center text-xs bg-gray-900 bg-opacity-90 rounded rounded-t-none p-1 w-24">
      {fish.name}
    </span>
  </div>
);
export default memo(FishMiniCard);
