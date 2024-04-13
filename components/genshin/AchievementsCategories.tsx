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
    [],
  );
  return (
    <div className="custom-scroll flex h-[300px] w-full flex-shrink-0 flex-col gap-2 overflow-y-auto pb-4 pl-2 pr-2 text-white md:pl-0 lg:sticky lg:h-[91vh] lg:w-[260px] lg:overflow-y-scroll">
      {categories
        .sort((a, b) => a.order - b.order)
        .map((cat) => (
          <div
            className={clsx(
              "flex cursor-pointer flex-col rounded-xl border-2 border-white p-2 transition-all hover:border-vulcan-500 hover:bg-vulcan-600 focus:border-vulcan-500",
              cat.id === categorySelected.id
                ? "border-opacity-30 bg-vulcan-600"
                : "border-opacity-0 bg-vulcan-700",
            )}
            key={cat.id}
            onClick={() => {
              trackClick("achievement_category");
              onClickCategory(cat);
            }}
          >
            <p className="font-semibold text-white">{cat.name}</p>
            <div className="flex">
              <p className="flex-1 text-gray-400">
                {achievementsDone[cat.id]?.length ?? 0}/
                {cat.achievements.length} (
                {numFormat.format(
                  ((achievementsDone[cat.id]?.length ?? 0) * 100) /
                    cat.achievements.length,
                )}
                %)
              </p>{" "}
              <p className="text-gray-400">
                {cat.achievements.reduce((acc, val) => acc + val.reward, 0)}
              </p>{" "}
              <Image
                src="/primogem.png"
                className="ml-1 h-6 w-6"
                width={24}
                height={24}
                alt="primogem"
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AchievementsCategories;
