import clsx from "clsx";
import { memo } from "react";

import type { Fish } from "@interfaces/genshin";

import Image from "./Image";

interface FishMiniCardProps {
  fish: Fish;
  isSelected: (id: string) => boolean;
}

const FishMiniCard = ({ fish, isSelected }: FishMiniCardProps) => (
  <div className="inline-block">
    <div
      className={clsx(
        "relative m-1 mb-0 block h-24 w-24 overflow-hidden rounded rounded-b-none bg-cover text-center",
        `genshin-bg-rarity-${fish.rarity}`,
        {
          "opacity-100": isSelected(fish.id),
          "opacity-30": !isSelected(fish.id),
        },
      )}
    >
      <Image
        className="absolute bottom-1 right-1 w-7 rounded-full bg-vulcan-800"
        src={`/baits/${fish.bait.id}.png`}
        alt={fish.bait.name}
        title={fish.bait.name}
        width={28}
        height={28}
      />
      <Image
        src={`/fish/${fish.id}.png`}
        alt={fish.name}
        title={fish.name}
        width={96}
        height={96}
      />
    </div>
    <span className="m-1 mt-0 inline-block w-24 overflow-hidden rounded rounded-t-none bg-gray-900 bg-opacity-90 p-1 text-center text-xs">
      {fish.name}
    </span>
  </div>
);
export default memo(FishMiniCard);
