import { useCallback, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData, { AchievementCategory } from "genshin-data";
import { AiOutlineCheck } from "react-icons/ai";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { localeToLang } from "@utils/locale-to-lang";
import Input from "@components/Input";
import { getUrl } from "@lib/imgUrl";
import clsx from "clsx";
import { achievementsCompleted } from "@state/achievements";

type TodoProps = {
  categories: AchievementCategory[];
};

const AchivementsPage = ({ categories }: TodoProps) => {
  const [category, setCategory] = useState(categories[0]);
  const [showAchieved, setShowAchieved] = useState(false);
  const [searchText, setSearchText] = useState("");
  const achievementsDone = useStore(achievementsCompleted);
  const { t } = useIntl();

  const filteredAchievements = useMemo(
    () =>
      category.achievements.filter((ach) =>
        ach.name.toLowerCase().includes(searchText.toLowerCase())
      ),
    [category, searchText]
  );

  const selectAchievement = useCallback(
    (catId: number, id: number) => {
      if (!achievementsDone[catId]) {
        achievementsDone[catId] = [];
      }

      const exist = achievementsDone[catId].find((a) => a === id);

      if (exist) {
        achievementsDone[catId] = achievementsDone[catId].filter(
          (a) => a !== id
        );
      } else {
        achievementsDone[catId] = [...achievementsDone[catId], id];
      }
      achievementsCompleted.set(achievementsDone);
    },
    [achievementsDone]
  );

  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });

  return (
    <div className="w-full">
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.achievements",
          defaultMessage: "Achievements",
        })}
        pageDescription={t({
          id: "title.achievements.description",
          defaultMessage: "Track your Genshin Impact achievement easily",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex-row lg:flex">
        <div className="lg:h-screen w-full lg:w-[260px] lg:sticky lg:top-16 flex-shrink-0 text-white lg:overflow-y-scroll custom-scroll flex flex-col pb-4 pr-2 gap-2">
          {categories
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <div
                className={clsx(
                  "rounded-xl p-2 cursor-pointer flex flex-col border-2 border-white hover:border-vulcan-500 focus:border-vulcan-500 hover:bg-vulcan-600 transition-all",
                  cat.id === category.id
                    ? "bg-vulcan-600 border-opacity-10"
                    : "bg-vulcan-700 border-opacity-0"
                )}
                key={cat.id}
                onClick={() => setCategory(cat)}
              >
                <p className="font-semibold text-white">{cat.name}</p>
                <div className="flex">
                  <p className="flex-1 text-gray-400">
                    {achievementsDone[cat.originalId]?.length ?? 0}/
                    {cat.achievements.length} (
                    {numFormat.format(
                      ((achievementsDone[cat.originalId]?.length ?? 0) * 100) /
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
        <div className="w-full text-white xl:px-4">
          <div className="bg-vulcan-800 shadow rounded-2xl py-3 px-3 pb-2 z-50 lg:sticky lg:top-12">
            <div className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  className="pr-8 w-32 sm:w-64"
                  placeholder={t({ id: "search", defaultMessage: "Search" })}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="ml-auto">
                <label className="flex items-center">
                  <input
                    className="mr-2 w-4 h-4"
                    type="checkbox"
                    checked={showAchieved}
                    onChange={() => setShowAchieved((a) => !a)}
                  />
                  {t({ id: "show_achieved", defaultMessage: "Show Achieved" })}
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 flex-1 pt-20 lg:pt-2">
            {filteredAchievements
              .sort((a, b) => a.order - b.order)
              .filter((ach) =>
                !showAchieved
                  ? !achievementsDone[category.originalId]?.includes(ach.id)
                  : true
              )
              .map((ach) => (
                <div
                  key={ach.id}
                  className={clsx(
                    "bg-vulcan-800 shadow rounded-2xl py-3 px-3 text-white flex items-center",
                    {
                      "opacity-50": achievementsDone[
                        category.originalId
                      ]?.includes(ach.id),
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
                    <div className="mr-1 font-semibold text-lg">
                      {ach.reward}
                    </div>
                    <img
                      src={getUrl("/primogem.png", 28, 28)}
                      alt="primogem"
                      className="w-6"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        selectAchievement(category.originalId, ach.id)
                      }
                      className="rounded-xl ml-1 flex items-center justify-center p-2 transition-all bg-gray-700"
                      title={t({
                        id: "show_achieved",
                        defaultMessage: "Show Achieved",
                      })}
                    >
                      <AiOutlineCheck
                        className={clsx({
                          "text-white": achievementsDone[
                            category.originalId
                          ]?.includes(ach.id),
                        })}
                      />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const genshinData = new GenshinData({ language: localeToLang(locale) });

  const categories = await genshinData.achievements();

  return {
    props: { lngDict, categories },
  };
};

export default AchivementsPage;
