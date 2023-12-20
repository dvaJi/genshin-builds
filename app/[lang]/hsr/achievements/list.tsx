"use client";

import useIntl from "@hooks/use-intl";
import { useStore } from "@nanostores/react";
import { $achievements } from "@state/hsr-achievements";
import type { Achievement } from "@interfaces/hsr";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

const AchievementsCategories = dynamic(
  () => import("@components/hsr/AchievementsCategories"),
  { ssr: false }
);
const AchievementsList = dynamic(
  () => import("@components/hsr/AchievementsList"),
  { ssr: false }
);
const AchievementsTotal = dynamic(
  () => import("@components/hsr/AchievementsTotal"),
  { ssr: false }
);

export type Category = {
  id: number;
  name: string;
  achievements: {
    _id: number;
    r: number;
  }[];
};

type Props = {
  achievements: Record<number, Achievement>;
  categories: Category[];
  rewardValue: Record<string, number>;
};

export default function List({ categories, achievements, rewardValue }: Props) {
  const [category, setCategory] = useState(categories[0]);
  const [searchText, setSearchText] = useState("");
  const { t } = useIntl("achievements");
  const achievementsDone = useStore($achievements);

  const calculateProgress = useCallback(
    (ac: { _id: number; r: number }[]) => {
      const total = ac.length;
      const totalRewards = ac.reduce((a, b) => a + b.r || 0, 0);
      const completedAchievements = ac.filter(
        (a) => (achievementsDone?.ids || [])?.includes(a._id)
      );
      const collectedRewards = completedAchievements.reduce(
        (a, b) => a + b.r || 0,
        0
      );
      const completed = completedAchievements.length;
      const percentage = ((completed / total) * 100).toFixed(1);

      return {
        totalRewards,
        collectedRewards,
        completed,
        total,
        percentage,
      };
    },
    [achievementsDone?.ids]
  );

  const progress = useMemo(() => {
    return calculateProgress(
      Object.values(achievements).map((a) => ({
        _id: a._id,
        r: rewardValue[a.rarity],
      }))
    );
  }, [achievements, calculateProgress, rewardValue]);

  function toggleAchievement(id: number) {
    const _achievementsDone = { ...achievementsDone };
    if (!_achievementsDone.ids) {
      _achievementsDone.ids = [];
    }

    const exist = _achievementsDone.ids.find((a) => a === id);

    if (exist) {
      _achievementsDone.ids = _achievementsDone.ids.filter((a) => a !== id);
    } else {
      _achievementsDone.ids = [..._achievementsDone.ids, id];
    }

    $achievements.set(_achievementsDone);
  }

  return (
    <menu className="w-full">
      <AchievementsTotal progress={progress} />
      <div className="flex h-full gap-2">
        <div className="sticky top-0 flex h-screen flex-col gap-2 overflow-y-auto px-1 pt-2">
          <input
            className="h-10 w-full rounded-md bg-transparent px-4 text-white outline-none focus:ring-hsr-accent"
            placeholder={t({
              id: "search",
              defaultMessage: "Search...",
            })}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <AchievementsCategories
            selectedCategory={category.id}
            categories={categories}
            calculateProgress={calculateProgress}
            onClickCategory={setCategory}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 pt-2">
          <AchievementsList
            category={category}
            achievements={achievements}
            selecteds={achievementsDone.ids}
            onClickAchievement={toggleAchievement}
          />
        </div>
      </div>
    </menu>
  );
}
