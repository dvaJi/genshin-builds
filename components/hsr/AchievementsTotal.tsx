import { getHsrUrl } from "@lib/imgUrl";
import { memo } from "react";

type Props = {
  progress: {
    totalRewards: number;
    collectedRewards: number;
    completed: number;
    total: number;
    percentage: string;
  };
};

function AchievementsTotal({ progress }: Props) {
  return (
    <div className="flex items-center">
      <div className="ml-1">
        <p className="mt-1 rounded-md border border-hsr-accent bg-hsr-accent/80 px-2 text-xl font-medium text-white">
          {progress.completed} / {progress.total} ({progress.percentage}%)
        </p>
      </div>
      <div className="ml-4">
        <p className="mt-1 flex items-center rounded-md border border-hsr-accent bg-hsr-accent/80 px-2 text-xl font-medium text-white">
          {progress.collectedRewards} / {progress.totalRewards}
          <img
            src={getHsrUrl("/stellar_jade.png")}
            alt="Stellar Jade"
            className="ml-2 h-6 w-6"
          />
        </p>
      </div>
    </div>
  );
}

export default memo(AchievementsTotal);
