import clsx from "clsx";
import { getUrl } from "@lib/imgUrl";
import { Achievement } from "genshin-data";
import { AiOutlineCheck } from "react-icons/ai";
import useIntl from "@hooks/use-intl";
import { trackClick } from "@lib/gtag";

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
    <div className="flex flex-col space-y-2 flex-1 pt-20 lg:pt-2">
      {achievements
        .sort((a, b) => a.order - b.order)
        .filter((ach) =>
          !showCompleted ? !achievementsDone?.includes(ach.id) : true
        )
        .map((ach) => (
          <div
            key={ach.id}
            className={clsx(
              "bg-vulcan-800 shadow rounded-2xl py-3 px-3 text-white flex items-center",
              {
                "opacity-50": achievementsDone?.includes(ach.id),
              }
            )}
          >
            <div className="flex-1">
              <p className="font-semibold md:text-lg leading-tight">
                {ach.name}
              </p>
              <p className="mt-px opacity-75 leading-tight text-sm md:text-base">
                {ach.desc}
              </p>
            </div>
            <div className="flex items-center">
              <div className="mr-1 font-semibold text-lg">{ach.reward}</div>
              <img
                src={getUrl("/primogem.png", 28, 28)}
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
                    }`
                  );
                  selectAchievement(ach.id);
                }}
                className="rounded-xl ml-1 flex items-center justify-center p-2 transition-all bg-gray-700"
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
