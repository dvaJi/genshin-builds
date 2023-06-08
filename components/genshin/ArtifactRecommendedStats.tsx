import useIntl from "@hooks/use-intl";
import { memo } from "react";
import { GiCrenelCrown, GiSandsOfTime } from "react-icons/gi";
import { RiGobletFill } from "react-icons/ri";

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
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <GiSandsOfTime className="mr-1 inline text-xl text-white" />
          <span className="text-xs text-slate-200">
            {t({ id: "sands", defaultMessage: "Sands" })}
          </span>
        </div>
        <p className="text-sm text-slate-300">{stats.sands.join(" / ")}</p>
      </div>
      <div className="svelte-ti79zj mt-1 flex items-center">
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <RiGobletFill className="mr-1 inline text-xl text-white" />
          <span className="text-xs text-slate-200">
            {t({ id: "goblet", defaultMessage: "Goblet" })}
          </span>
        </div>
        <p className="text-sm text-slate-300">{stats.goblet.join(" / ")}</p>
      </div>
      <div className="svelte-ti79zj mt-1 flex items-center">
        <div className="mr-2 rounded-md bg-vulcan-900 px-2 py-1">
          <GiCrenelCrown className="mr-1 inline text-xl text-white" />
          <span className="text-xs text-slate-200">
            {t({ id: "circlet", defaultMessage: "Circlet" })}
          </span>
        </div>
        <p className="text-sm text-slate-300">{stats.circlet.join(" / ")}</p>
      </div>
    </div>
  );
};

export default memo(ArtifactRecommendedStats);
