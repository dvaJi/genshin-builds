"use client";

import { useStore } from "@nanostores/react";
import type { AchievementCategory } from "genshin-data";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import { $achievementsCompleted } from "@state/achievements";

const AchievementsSearch = dynamic(
  () => import("@components/genshin/AchievementsSearch"),
  {
    ssr: false,
  }
);

const AchievementsList = dynamic(
  () => import("@components/genshin/AchievementsList"),
  {
    ssr: false,
  }
);

const AchievementsCategories = dynamic(
  () => import("@components/genshin/AchievementsCategories"),
  {
    ssr: false,
  }
);

type Props = {
  categories: AchievementCategory[];
};

export default function AchievementsWrapper({ categories }: Props) {
  const [category, setCategory] = useState(categories[0]);
  const [showAchieved, setShowAchieved] = useState(false);
  const [searchText, setSearchText] = useState("");
  const achievementsDone = useStore($achievementsCompleted);

  const filteredAchievements = useMemo(
    () =>
      category.achievements.filter((ach) =>
        ach.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [category, searchText]
  );

  const selectAchievement = useCallback(
    (id: number) => {
      const catId = category.id;
      const _achievementsDone = { ...achievementsDone };
      if (!_achievementsDone[catId]) {
        _achievementsDone[catId] = [];
      }

      const exist = _achievementsDone[catId].find((a) => a === id);

      if (exist) {
        _achievementsDone[catId] = _achievementsDone[catId].filter(
          (a) => a !== id
        );
      } else {
        _achievementsDone[catId] = [..._achievementsDone[catId], id];
      }

      $achievementsCompleted.set(_achievementsDone);
    },
    [achievementsDone, category.id]
  );
  return (
    <div className="flex-row lg:flex">
      <AchievementsCategories
        achievementsDone={achievementsDone}
        categories={categories}
        categorySelected={category}
        onClickCategory={setCategory}
      />
      <div className="w-full text-white xl:px-4">
        <AchievementsSearch
          onSearch={setSearchText}
          onShowAchieved={() => setShowAchieved((a) => !a)}
          showAchieved={showAchieved}
        />
        <AchievementsList
          achievements={filteredAchievements}
          achievementsDone={achievementsDone[category.id]}
          selectAchievement={selectAchievement}
          showCompleted={showAchieved}
        />
      </div>
    </div>
  );
}
