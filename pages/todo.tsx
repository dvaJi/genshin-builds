import { InferGetStaticPropsType } from "next";
import GenshinData from "genshin-data";
import dynamic from "next/dynamic";

import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

const Todo = dynamic(() => import("@components/genshin/Todo"), {
  ssr: false,
});

const TodoPage = ({
  planning,
  materialsMap,
  days,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useIntl("todo");

  return (
    <div className="px-4">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Todo List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Todo List for Genshin Impact to plan and track resources you need!",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "todo", defaultMessage: "Todo List" })}
      </h2>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <Todo materialsMap={materialsMap} planning={planning} days={days} />
    </div>
  );
};

export const getStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");

  const genshinData = new GenshinData({ language: localeToLang(locale) });

  const materialsMap = await getAllMaterialsMap(genshinData);

  // console.log(materialsMap);

  const domains = await genshinData.domains();
  const planning = [...domains.characters, ...domains.weapons].reduce<
    Record<string, string[]>
  >((acc, cur) => {
    const { rotation } = cur;

    rotation.forEach(({ day, ids }) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(...ids);
    });

    return acc;
  }, {});

  return {
    props: {
      planning,
      materialsMap,
      lngDict,
      days: domains.characters[0].rotation.map((r) => r.day),
      bgStyle: {
        image: getUrlLQ(`/regions/Mondstadt_n.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export default TodoPage;
