"use client";

import { useState } from "react";

import FishingPointCard from "@components/genshin/FishingPointCard";
import { getUrl } from "@lib/imgUrl";
import clsx from "clsx";
import type { Fish } from "@interfaces/genshin";
import { FishingPoint } from "interfaces/fishing";

type Props = {
  fish: Record<string, Fish>;
  // baits: Record<string, Bait>;
  // fishingRods: Record<string, FishingRod>;
  // common: Record<string, string>;
  fishingPoints: Record<string, FishingPoint[]>;
};

export default function GenshinFishingList({ fish, fishingPoints }: Props) {
  const [fishFilter, setFishFilter] = useState<string[]>([]);

  const toggleFish = (id: string) => {
    const exist = fishFilter.includes(id);
    if (exist) {
      setFishFilter(fishFilter.filter((f) => f !== id));
    } else {
      setFishFilter([...fishFilter, id]);
    }
  };

  const filterPoints = (point: FishingPoint) => {
    if (fishFilter.length === 0) {
      return true;
    }

    return !!fishFilter.find((f) => point.fish.includes(f));
  };

  const isFishSelected = (id: string) => {
    if (fishFilter.length === 0) {
      return true;
    }

    return !!fishFilter.includes(id);
  };

  return (
    <>
      <div>
        {Object.values(fish).map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFish(f.id)}
            className={clsx(
              "mr-1 rounded border hover:border-gray-700 hover:bg-vulcan-800 hover:opacity-90",
              fishFilter.includes(f.id)
                ? "border-gray-700 bg-vulcan-800 opacity-100"
                : "border-gray-800 opacity-70"
            )}
          >
            <img
              className="mr-3 h-12 w-12"
              src={getUrl(`/fish/${f.id}.png`, 48, 48)}
              alt={f.name}
              title={f.name}
            />
          </button>
        ))}
      </div>
      <div className="">
        {Object.keys(fishingPoints).map((city) => (
          <FishingPointCard
            key={city}
            city={city}
            fishingPoints={fishingPoints[city].filter(filterPoints)}
            fish={fish}
            isFishSelected={isFishSelected}
          />
        ))}
      </div>
    </>
  );
}
