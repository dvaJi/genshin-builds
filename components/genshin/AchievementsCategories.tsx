import clsx from "clsx";
import { useMemo } from "react";

import type { AchievementCategory } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";
import { AchievementsCompleted } from "@state/achievements";

import Image from "./Image";

type Props = {
  categorySelected: AchievementCategory;
  categories: AchievementCategory[];
  achievementsDone: AchievementsCompleted;
  onClickCategory: (cat: AchievementCategory) => void;
};

const AchievementsCategories = ({
  achievementsDone,
  categorySelected,
  categories,
  onClickCategory,
}: Props) => {
  const numFormat = useMemo(
    () => Intl.NumberFormat(undefined, { notation: "compact" }),
    []
  );
  return (
    <div className="space-y-4">
      {categories
        .sort((a, b) => a.order - b.order)
        .map((cat) => (
          <div
            className={clsx(
              "group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:bg-card/80",
              cat.id === categorySelected.id && "ring-2 ring-primary"
            )}
            key={cat.id}
            onClick={() => {
              trackClick("achievement_category");
              onClickCategory(cat);
            }}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium text-foreground">
                {cat.name}
              </h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {achievementsDone[cat.id]?.length ?? 0}/
                  {cat.achievements.length} (
                  {numFormat.format(
                    ((achievementsDone[cat.id]?.length ?? 0) * 100) /
                      cat.achievements.length
                  )}
                  %)
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground">
                    {cat.achievements.reduce((acc, val) => acc + val.reward, 0)}
                  </span>
                  <Image
                    src="/primogem.png"
                    className="h-5 w-5"
                    width={20}
                    height={20}
                    alt="primogem"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AchievementsCategories;
