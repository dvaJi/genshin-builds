import { getUrl } from "@/lib/img";
import { memo } from "react";

type Sets = {
  flower: string[];
  plume: string[];
  sands: string[];
  goblet: string[];
  circlet: string[];
};

interface ArtifactRecommendedStatsProps {
  stats: Sets;
  dict: Record<string, string>;
}

const ArtifactRecommendedStats = ({
  stats,
  dict,
}: ArtifactRecommendedStatsProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <img
            src={getUrl("/sands.png", 24, 24)}
            className="mr-1 inline h-6 w-6"
          />
          <span className="font-semibold">{dict["sands"]}</span>
        </div>
        <p>{stats.sands.join(" / ")}</p>
      </div>
      <div className="svelte-ti79zj mt-1 flex items-center">
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <img
            src={getUrl("/goblet.png", 24, 24)}
            className="mr-1 inline h-6 w-6"
          />
          <span className="font-semibold">{dict["goblet"]}</span>
        </div>
        <p>{stats.goblet.join(" / ")}</p>
      </div>
      <div className="svelte-ti79zj mt-1 flex items-center">
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <img
            src={getUrl("/circlet.png", 24, 24)}
            className="mr-1 inline h-6 w-6"
          />
          <span className="font-semibold">{dict["circlet"]}</span>
        </div>
        <p>{stats.circlet.join(" / ")}</p>
      </div>
    </div>
  );
};

export default memo(ArtifactRecommendedStats);
