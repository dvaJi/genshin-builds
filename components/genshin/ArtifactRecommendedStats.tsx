import { memo } from "react";
import { RiGobletFill } from "react-icons/ri";
import { GiSandsOfTime, GiCrenelCrown } from "react-icons/gi";
import useIntl from "@hooks/use-intl";

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
  const { t } = useIntl("character");
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <div className="px-2 py-1 mr-2 bg-vulcan-900 rounded-md">
          <GiSandsOfTime className="inline text-xl text-white mr-1" />
          <span className="font-semibold">
            {t({ id: "sands", defaultMessage: "Sands" })}
          </span>
        </div>
        <p>{stats.sands.join(" / ")}</p>
      </div>
      <div className="flex items-center mt-1 svelte-ti79zj">
        <div className="px-2 py-1 mr-2 bg-vulcan-900 rounded-md">
          <RiGobletFill className="inline text-xl text-white mr-1" />
          <span className="font-semibold">
            {t({ id: "goblet", defaultMessage: "Goblet" })}
          </span>
        </div>
        <p>{stats.goblet.join(" / ")}</p>
      </div>
      <div className="flex items-center mt-1 svelte-ti79zj">
        <div className="px-2 py-1 mr-2 bg-vulcan-900 rounded-md">
          <GiCrenelCrown className="inline text-xl text-white mr-1" />
          <span className="font-semibold">
            {t({ id: "circlet", defaultMessage: "Circlet" })}
          </span>
        </div>
        <p>{stats.circlet.join(" / ")}</p>
      </div>
    </div>
  );
};

export default memo(ArtifactRecommendedStats);
