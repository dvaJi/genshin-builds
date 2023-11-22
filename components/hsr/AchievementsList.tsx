import type { Achievement } from "hsr-data";
import { memo } from "react";

import type { Category } from "@app/hsr/achievements/list";
import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  category: Category;
  achievements: Record<number, Achievement>;
  selecteds: number[];
  onClickAchievement: (id: number) => void;
};

function AchievementsList({
  category,
  achievements,
  onClickAchievement,
  selecteds,
}: Props) {
  return category.achievements.map((ach) => (
    <div
      key={ach._id}
      className="flex items-center rounded-md bg-hsr-surface3 px-4 py-2 leading-tight ring-1 ring-transparent hover:ring-hsr-accent"
    >
      <div>
        <p
          className="font-semibold text-white"
          dangerouslySetInnerHTML={{
            __html: achievements[ach._id].name,
          }}
        />
        <p
          className="whitespace-pre-line text-white/80"
          dangerouslySetInnerHTML={{
            __html: achievements[ach._id].description,
          }}
        />
      </div>
      <div className="flex-1" />
      <p className="mr-1 text-white/80">{ach.r}</p>
      <img
        src={getHsrUrl("/stellar_jade.png")}
        alt="jade"
        className="h-6 w-6"
      />
      <div className="relative flex items-center justify-center">
        <input
          onChange={() => onClickAchievement(ach._id)}
          type="checkbox"
          checked={selecteds?.includes(ach._id)}
          className="rounded border-hsr-surface1 text-hsr-accent shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 focus:ring-offset-0"
        />
      </div>
    </div>
  ));
}

export default memo(AchievementsList);
