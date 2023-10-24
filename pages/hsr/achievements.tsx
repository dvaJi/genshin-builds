import { useStore } from "@nanostores/react";
import HSRData, { type Achievement } from "hsr-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";

import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { $achievements } from "@state/hsr-achievements";
import { localeToHSRLang } from "@utils/locale-to-lang";
import { useCallback, useMemo, useState } from "react";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });
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
  sort: number;
  achievements: {
    _id: number;
    r: number;
  }[];
};

type Props = {
  achievements: Record<number, Achievement>;
  categories: Category[];
};

const rewardValue = {
  Low: 5,
  Mid: 10,
  High: 20,
};

function HSRAchievements({ categories, achievements }: Props) {
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
  }, [achievements, calculateProgress]);

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
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Achievements",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "A complete list of all achievements in Honkai: Star Rail.",
        })}
      />
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "achievements",
          defaultMessage: "Achievements",
        })}
      </h2>
      <p className="px-4 text-sm">
        {t({
          id: "achievements_desc",
          defaultMessage:
            "List of all achievements in Honkai Star Rail and how to complete them so you can score some Stellar Jades easily.",
        })}
      </p>
      <div className="mt-4"></div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
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
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const achievements = await hsrData.achievements();

  const allSeriesText = [
    ...new Set(
      achievements.map((a) => a.seriesText).filter((a) => a !== undefined)
    ),
  ];
  const categories = allSeriesText
    .map((name) => {
      const a = achievements.filter((a) => a.seriesText === name);
      const nonDuplicate = [...new Set(a.map((a) => a._id))];

      return {
        id: a[0].seriesId,
        name,
        achievements: nonDuplicate.map((id) => ({
          _id: id,
          r: rewardValue[a.find((a) => a._id === id)?.rarity || "Low"],
        })),
      };
    })
    .sort((a, b) => a.id - b.id);

  return {
    props: {
      categories,
      achievements: achievements.reduce(
        (a, b) => {
          a[b._id] = b;
          return a;
        },
        {} as Record<number, Achievement>
      ),
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
  };
};

export default HSRAchievements;
