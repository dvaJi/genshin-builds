"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

import Button from "@components/ui/Button";
import type { AchievementCategory } from "@interfaces/genshin";
import { useStore } from "@nanostores/react";
import { $achievementsCompleted } from "@state/achievements";

const AchievementsSearch = dynamic(
  () => import("@components/genshin/AchievementsSearch"),
  {
    ssr: false,
  },
);

const AchievementsList = dynamic(
  () => import("@components/genshin/AchievementsList"),
  {
    ssr: false,
  },
);

const AchievementsCategories = dynamic(
  () => import("@components/genshin/AchievementsCategories"),
  {
    ssr: false,
  },
);

interface Props {
  categories: AchievementCategory[];
}

export default function AchievementsWrapper({ categories }: Props) {
  const [category, setCategory] = useState(categories[0]);
  const [showAchieved, setShowAchieved] = useState(false);
  const [searchText, setSearchText] = useState("");
  const achievementsDone = useStore($achievementsCompleted);

  const filteredAchievements = useMemo(
    () =>
      category.achievements.filter((ach) =>
        ach.name.toLowerCase().includes(searchText.toLowerCase()),
      ),
    [category, searchText],
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
          (a) => a !== id,
        );
      } else {
        _achievementsDone[catId] = [..._achievementsDone[catId], id];
      }

      $achievementsCompleted.set(_achievementsDone);
    },
    [achievementsDone, category.id],
  );

  const handleCategoryClick = useCallback((cat: AchievementCategory) => {
    setCategory(cat);
    setSearchText("");
  }, []);

  const exportAchievements = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(achievementsDone));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      "genshin-impact-com-genshin-achievements.json",
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="relative mx-auto max-w-screen-lg">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <AchievementsCategories
          achievementsDone={achievementsDone}
          categories={categories}
          categorySelected={category}
          onClickCategory={handleCategoryClick}
        />
        <div className="space-y-4">
          <AchievementsSearch
            onSearch={setSearchText}
            onShowAchieved={() => setShowAchieved((a) => !a)}
            showAchieved={showAchieved}
          />
          <div className="rounded-lg border bg-card/50">
            <AchievementsList
              achievements={filteredAchievements}
              achievementsDone={achievementsDone[category.id]}
              selectAchievement={selectAchievement}
              showCompleted={showAchieved}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={exportAchievements}>Export Achievements</Button>
      </div>
    </div>
  );
}
