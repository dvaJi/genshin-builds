import clsx from "clsx";
import { memo } from "react";

import type { Category } from "@app/[lang]/hsr/achievements/list";
import { cn } from "@app/lib/utils";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  categories: Category[];
  calculateProgress: (ac: { _id: number; r: number }[]) => {
    totalRewards: number;
    collectedRewards: number;
    completed: number;
    total: number;
    percentage: string;
  };
  selectedCategory: number;
  onClickCategory: (category: any) => void;
};

function AchievementsCategories({
  selectedCategory,
  categories,
  calculateProgress,
  onClickCategory,
}: Props) {
  return categories.map((category) => {
    const progress = calculateProgress(category.achievements);
    return (
      <button
        key={category.name}
        className={clsx(
          "flex cursor-pointer items-center rounded-md bg-card px-4 py-2 leading-tight ring-1 ring-transparent hover:bg-muted hover:ring-accent",
          {
            "bg-primary hover:bg-primary/80 hover:ring-primary":
              category.id === selectedCategory,
          },
        )}
        onClick={() => onClickCategory(category)}
      >
        <img
          src={getHsrUrl(`/achievements/${category.id}.png`, 55, 55)}
          alt="icon"
          className="mr-2 h-12 w-12"
        />
        <div className="w-full text-left">
          <p
            className={cn({
              "text-primary-foreground": category.id === selectedCategory,
              "text-card-foreground": category.id !== selectedCategory,
            })}
          >
            {category.name}
          </p>
          <div className="flex justify-between">
            <p className="mt-1 inline-block text-sm">
              {progress.completed}/{progress.total} ({progress.percentage}%)
            </p>
            <div
              className={cn("mt-1 flex items-center rounded-md px-1 text-sm", {
                "bg-background":
                  progress.collectedRewards !== progress.totalRewards,
                "bg-accent":
                  progress.collectedRewards === progress.totalRewards,
              })}
            >
              {progress.collectedRewards}/{progress.totalRewards}
              <img
                src={getHsrUrl("/stellar_jade.png")}
                alt="jade"
                className="ml-1 inline-block h-4 w-4"
              />
            </div>
          </div>
        </div>
      </button>
    );
  });
}

export default memo(AchievementsCategories);
