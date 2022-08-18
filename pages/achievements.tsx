import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData, { AchievementCategory } from "genshin-data";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { localeToLang } from "@utils/locale-to-lang";
import { achievementsCompleted } from "@state/achievements";

const AchievementsSearch = dynamic(
  () => import("@components/AchievementsSearch"),
  {
    ssr: false,
  }
);

const AchievementsList = dynamic(() => import("@components/AchievementsList"), {
  ssr: false,
});

const AchievementsCategories = dynamic(
  () => import("@components/AchievementsCategories"),
  {
    ssr: false,
  }
);

type TodoProps = {
  categories: AchievementCategory[];
};

const AchivementsPage = ({ categories }: TodoProps) => {
  const [category, setCategory] = useState(categories[0]);
  const [showAchieved, setShowAchieved] = useState(false);
  const [searchText, setSearchText] = useState("");
  const achievementsDone = useStore(achievementsCompleted);
  const { t } = useIntl("achievements");

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

      achievementsCompleted.set(_achievementsDone);
    },
    [achievementsDone, category.id]
  );

  return (
    <div className="w-full">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Achievements",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Track your Genshin Impact achievement easily",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
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
