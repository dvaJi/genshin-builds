import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData from "genshin-data";
import dynamic from "next/dynamic";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";

import { todos as todosAtom } from "../state/todo";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";

const Todo = dynamic(() => import("@components/Todo"), {
  ssr: false,
});

type TodoProps = {
  planning: Record<string, any>;
  materialsMap: Record<string, any>;
  days: string[];
};

const TodoPage = ({ planning, materialsMap, days }: TodoProps) => {
  const todos = useStore(todosAtom);
  // const { summary, originalSummary } = useStore(getSummary);
  const { t } = useIntl("todo");

  // console.log(todos, summary, planning, todoIdsByResource);
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
      <Todo todos={todos} materialsMap={materialsMap} planning={planning} days={days} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

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
    },
  };
};

export default TodoPage;
