import { memo } from "react";

import { Badge } from "@app/components/ui/badge";
import { getHsrUrl } from "@lib/imgUrl";

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
    <div className="flex items-center gap-2">
      <Badge className="py-1">
        {progress.completed} / {progress.total} ({progress.percentage}%)
      </Badge>
      <Badge>
        {progress.collectedRewards} / {progress.totalRewards}
        <img
          src={getHsrUrl("/stellar_jade.png")}
          alt="Stellar Jade"
          className="ml-2 h-5 w-5"
        />
      </Badge>
      {/* <div className="ml-1">
        <p className="mt-1 rounded-md border border-accent bg-accent/80 px-2 text-xl font-medium text-accent-foreground">
          {progress.completed} / {progress.total} ({progress.percentage}%)
        </p>
      </div>
      <div className="ml-4">
        <p className="mt-1 flex items-center rounded-md border border-accent bg-accent/80 px-2 text-xl font-medium text-accent-foreground">
          {progress.collectedRewards} / {progress.totalRewards}
          <img
            src={getHsrUrl("/stellar_jade.png")}
            alt="Stellar Jade"
            className="ml-2 h-6 w-6"
          />
        </p>
      </div> */}
    </div>
  );
}

export default memo(AchievementsTotal);
