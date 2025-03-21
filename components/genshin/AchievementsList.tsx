import clsx from "clsx";
import { AiOutlineCheck } from "react-icons/ai";

import Image from "@components/genshin/Image";

interface Props {
  achievements: any[];
  achievementsDone?: number[];
  selectAchievement: (id: number) => void;
  showCompleted: boolean;
}

export default function AchievementsList({
  achievements,
  achievementsDone,
  selectAchievement,
  showCompleted,
}: Props) {
  return (
    <div className="divide-y divide-border">
      {showCompleted
        ? achievements.map((ach) => RowItem(ach))
        : achievements
            .filter((ach) => !achievementsDone?.includes(ach.id))
            .map((ach) => RowItem(ach))}
    </div>
  );

  function RowItem(ach: any) {
    return (
      <div
        key={ach.id}
        className={clsx(
          "flex items-center justify-between gap-4 px-4 py-3 transition-colors",
          {
            "bg-muted/50": achievementsDone?.includes(ach.id),
          },
        )}
      >
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-medium leading-none text-foreground">
            {ach.name}
          </h4>
          <p className="text-sm text-muted-foreground">{ach.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-foreground">
              {ach.reward}
            </span>
            <Image
              src="/primogem.png"
              width={20}
              height={20}
              alt="primogem"
              className="h-5 w-5"
            />
          </div>
          <button
            onClick={() => {
              selectAchievement(ach.id);
            }}
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              achievementsDone?.includes(ach.id)
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
          >
            <AiOutlineCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
}
