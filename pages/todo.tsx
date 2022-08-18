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
};

const TodoPage = ({ planning, materialsMap }: TodoProps) => {
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
      <Todo todos={todos} materialsMap={materialsMap} planning={planning} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const talentsPlanning: Record<
    string,
    any
  > = require(`../_content/data/talents.json`);

  const genshinData = new GenshinData({ language: localeToLang(locale) });

  const materialsMap = await getAllMaterialsMap(genshinData);

  // console.log(materialsMap);

  const planning = Object.entries(talentsPlanning).reduce<
    Record<string, string[]>
  >((acc, cur) => {
    const [_, data] = cur;

    Object.entries(data).forEach(([day, iId]) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(...(iId as string[]));
    });

    return acc;
  }, {});

  return {
    props: { planning, materialsMap, lngDict },
  };
};

export default TodoPage;
