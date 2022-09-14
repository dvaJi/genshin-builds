import clsx from "clsx";
import { getUrl } from "@lib/imgUrl";
import { AchievementCategory } from "genshin-data";
import { useMemo } from "react";
import { AchievementsCompleted } from "@state/achievements";
import { trackClick } from "@lib/gtag";

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
    <div className="lg:h-[91vh] w-full lg:w-[260px] lg:sticky flex-shrink-0 text-white lg:overflow-y-scroll custom-scroll flex flex-col pb-4 pr-2 gap-2">
      {categories
        .sort((a, b) => a.order - b.order)
        .map((cat) => (
          <div
            className={clsx(
              "rounded-xl p-2 cursor-pointer flex flex-col border-2 border-white hover:border-vulcan-500 focus:border-vulcan-500 hover:bg-vulcan-600 transition-all",
              cat.id === categorySelected.id
                ? "bg-vulcan-600 border-opacity-10"
                : "bg-vulcan-700 border-opacity-0"
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
                    cat.achievements.length
                )}
                %)
              </p>{" "}
              <p className="text-gray-400">
                {cat.achievements.reduce((acc, val) => acc + val.reward, 0)}
              </p>{" "}
              <img
                src={getUrl("/primogem.png", 24, 24)}
                className="w-6 h-6 ml-1"
                alt="primogem"
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AchievementsCategories;
