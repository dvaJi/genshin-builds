import { memo } from "react";
import { RiGobletFill } from "react-icons/ri";
import {
  GiCottonFlower,
  GiFeather,
  GiSandsOfTime,
  GiCrenelCrown,
} from "react-icons/gi";

type Sets = {
  flower: string[];
  plume: string[];
  sands: string[];
  goblet: string[];
  circlet: string[];
};

interface ArtifactRecommendedStatsProps {
  stats: Sets;
}

const ArtifactRecommendedStats = ({ stats }: ArtifactRecommendedStatsProps) => {
  return (
    <div className="w-full flex flex-row py-2">
      <div className="flex-1 text-center">
        <div>
          <GiCottonFlower className="inline text-xl text-white" />
        </div>
        <div className="text-xs">
          {stats.flower.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div>
          <GiFeather className="inline text-xl text-white" />
        </div>
        <div className="text-xs">
          {stats.plume.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div>
          <GiSandsOfTime className="inline text-xl text-white" />
        </div>
        <div className="text-xs">
          {stats.sands.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div>
          <RiGobletFill className="inline text-xl text-white" />
        </div>
        <div className="text-xs">
          {stats.goblet.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </div>
      <div className="flex-1 text-center">
        <div>
          <GiCrenelCrown className="inline text-xl text-white" />
        </div>
        <div className="text-xs">
          {stats.circlet.map((s) => (
            <p>{s}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ArtifactRecommendedStats);
