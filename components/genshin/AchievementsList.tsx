import clsx from "clsx";
import { AiOutlineCheck } from "react-icons/ai";

import useIntl from "@hooks/use-intl";
import type { Achievement } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";

import Image from "./Image";

type Props = {
  achievements: Achievement[];
  achievementsDone: number[];
  showCompleted: boolean;
  selectAchievement: (id: number) => void;
};

const AchievementsList = ({
  achievementsDone,
  achievements,
  showCompleted,
  selectAchievement,
}: Props) => {
  const { t } = useIntl("achievements");
  return (
    <div className="flex flex-1 flex-col space-y-2 pt-20 lg:pt-2">
      {achievements
        .sort((a, b) => a.order - b.order)
        .filter((ach) =>
          !showCompleted ? !achievementsDone?.includes(ach.id) : true,
        )
        .map((ach) => (
          <div
            key={ach.id}
            className={clsx(
              "flex items-center rounded-2xl bg-vulcan-800 px-3 py-3 text-white shadow",
              {
                "opacity-50": achievementsDone?.includes(ach.id),
              },
            )}
          >
            <div className="flex-1">
              <p className="font-semibold leading-tight md:text-lg">
                {ach.name}
              </p>
              <p className="mt-px text-sm leading-tight opacity-75 md:text-base">
                {ach.desc}
              </p>
            </div>
            <div className="flex items-center">
              <div className="mr-1 text-lg font-semibold">{ach.reward}</div>
              <Image
                src="/primogem.png"
                width={24}
                height={24}
                alt="primogem"
                className="w-6"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  trackClick(
                    `achievement_${
                      achievementsDone?.includes(ach.id) ? "revert" : "done"
                    }`,
                  );
                  selectAchievement(ach.id);
                }}
                className="ml-1 flex items-center justify-center rounded-xl bg-gray-700 p-2 transition-all"
                title={t({
                  id: "show_achieved",
                  defaultMessage: "Show Achieved",
                })}
              >
                <AiOutlineCheck
                  className={clsx({
                    "text-white": achievementsDone?.includes(ach.id),
                  })}
                />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AchievementsList;
