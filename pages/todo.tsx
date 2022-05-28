import { useCallback, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData from "genshin-data";
import {
  CgArrowLongRight,
  CgChevronRight,
  CgChevronLeft,
} from "react-icons/cg";
import clsx from "clsx";
import Link from "next/link";
import { format } from "date-fns";

import Ads from "@components/Ads";
import Button from "@components/Button";
import Metadata from "@components/Metadata";
import ItemPopover from "@components/ItemPopover";
import ItemPopoverSummary from "@components/ItemPopoverSummary";

import { todos as todosAtom } from "../state/todo";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";

import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";

type TodoProps = {
  planning: Record<string, any>;
  common: Record<string, string>;
  materialsMap: Record<string, any>;
};

const TodoPage = ({ planning, materialsMap }: TodoProps) => {
  const [currentDay] = useState(format(new Date(), "iii"));
  const todos = useStore(todosAtom);
  // const { summary, originalSummary } = useStore(getSummary);
  const { t } = useIntl("todo");

  const { summary, originalSummary } = useMemo(() => {
    const summary: Record<string, number> = {};
    const originalSummary: Record<string, number> = {};

    todos.forEach((todo) => {
      Object.entries(todo[4]).forEach(([id, value]) => {
        if (!summary[id]) {
          summary[id] = 0;
          originalSummary[id] = 0;
        }
        summary[id] += value;
        originalSummary[id] += todo[5][id];
      });
    });

    return { summary, originalSummary };
  }, [todos]);

  const todoIdsByResource = useMemo(() => {
    return todos.reduce<Record<string, any[]>>((acc, todo, i) => {
      Object.keys(todo[4]).forEach((key) => {
        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push([
          todo[0].id,
          todo[5][key] - todo[4][key],
          todo[5][key],
          i,
        ]);
      });

      return acc;
    }, {});
  }, [todos]);

  const farmToday = useMemo(() => {
    const isSunday = currentDay === "Sun";
    return todos.reduce<Record<string, number>>((acc, value) => {
      if (isSunday || planning[currentDay].includes(value[0].id)) {
        for (const [id, data] of Object.entries(value[4])) {
          const mat = materialsMap[id];
          const isWeeklyBoss =
            mat.type === "talent_lvl_up_materials" && mat.rarity === 5;
          if (
            id !== "crown_of_insight" &&
            ["talent_lvl_up_materials", "weapon_primary_materials"].includes(
              mat.type
            ) &&
            !isWeeklyBoss
          ) {
            if (acc[id] === undefined) {
              acc[id] = 0;
            }
            acc[id] += data;
          }
        }
      }
      return acc;
    }, {});
  }, [currentDay, materialsMap, planning, todos]);

  const removeTodo = useCallback(
    (id: string) => {
      todosAtom.set(todos.filter((todo) => todo[0].id !== id));
    },
    [todos]
  );

  const moveTodo = useCallback(
    (id: string, index: number, newIndex: number) => {
      const todo = todos.find((todo) => todo[0].id === id);
      if (todo) {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        newTodos.splice(newIndex, 0, todo);
        todosAtom.set(newTodos);
      }
    },
    [todos]
  );

  const updateTodoResourcesById = useCallback(
    (id: string, newData: any) => {
      const todo = todos.find((todo) => todo[0].id === id);
      if (todo) {
        todo[4][newData.id] = newData.value;
        console.log(
          "updateTodoResourcesById",
          id,
          newData,
          todo[4][newData.id]
        );
        todosAtom.set(todos);
      }
    },
    [todos]
  );

  const updateAllTodoResourcesById = useCallback(
    (newData: any) => {
      const { idsByResource, remainingById } = newData;
      // console.log(idsByResource, remainingById);
      idsByResource.forEach((data: any, index: number) => {
        const todo = todos[data[3]];
        todo[4][newData.id] = remainingById[index];
        console.log(
          "updateAllTodoResourcesById",
          newData.id,
          todo[4][newData.id]
        );
      });
      todosAtom.set(todos);
    },
    [todos]
  );

  // console.log(todos, summary, planning, todoIdsByResource);
  return (
    <div className="px-4">
      <Metadata
        fn={t}
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
      <div>
        {todos.length === 0 && (
          <div className="rounded border border-vulcan-900 bg-vulcan-800 w-72 p-4">
            <p>
              {t({
                id: "no_todo_msg",
                defaultMessage: "No Todos. Add some from the calculator.",
              })}
            </p>
            <p>
              <Link href="/calculator">
                <a className="text-slate-300 hover:text-white">
                  {t({
                    id: "go_to_calculator",
                    defaultMessage: "Go to Calculator page",
                  })}
                </a>
              </Link>
            </p>
          </div>
        )}
      </div>
      <div>
        {todos.length > 0 && (
          <div className="inline-grid grid-cols-1 lg:grid-cols-4">
            <div className="">
              <div>
                <h1 className="p-2 text-lg font-semibold text-white">
                  {t({
                    id: "farm_today",
                    defaultMessage: "Farm today",
                  })}
                </h1>
                <div className="flex justify-center flex-wrap">
                  {Object.entries(farmToday).map(([id, data]) => (
                    <ItemPopoverSummary
                      key={id}
                      id={id}
                      data={data}
                      originalData={originalSummary[id]}
                      idsByResource={todoIdsByResource[id]}
                      handleOnChange={updateAllTodoResourcesById}
                      materialInfo={materialsMap[id]}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full rounded border border-vulcan-900 bg-vulcan-800">
                <h1 className="p-2 text-lg font-semibold text-white">
                  {t({
                    id: "summary",
                    defaultMessage: "Summary",
                  })}
                </h1>
                <div className="flex justify-center flex-wrap">
                  {Object.entries(summary).map(([id, data]) => (
                    <ItemPopoverSummary
                      key={id}
                      id={id}
                      data={data}
                      originalData={originalSummary[id]}
                      idsByResource={todoIdsByResource[id]}
                      handleOnChange={updateAllTodoResourcesById}
                      materialInfo={materialsMap[id]}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-3 inline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 m-3">
              {todos.map((todo, i) => (
                <div
                  key={todo[0].id + i}
                  className="flex w-full h-full rounded border border-vulcan-900 bg-vulcan-800"
                >
                  <div className="flex flex-col w-full relative flex-shrink-0">
                    <div className="flex justify-between p-2 mx-2">
                      <p className="text-lg font-semibold text-white">
                        {todo[0].name}
                      </p>
                      <div>
                        <button
                          onClick={() => moveTodo(todo[0].id, i, i - 1)}
                          disabled={i === 0}
                          className="text-white border-2 border-white border-opacity-10 rounded-none px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600 rounded-l-xl"
                        >
                          <CgChevronLeft />
                        </button>
                        <button
                          onClick={() => moveTodo(todo[0].id, i, i + 1)}
                          disabled={i + 1 === todos.length}
                          className="text-white border-2 border-white border-opacity-10 rounded-none px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600 rounded-r-xl"
                        >
                          <CgChevronRight />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col p-2 flex-grow justify-between">
                      <div className="flex items-center justify-between mb-2 min-h-[104px]">
                        <div className="flex justify-center ml-2">
                          <div
                            className="w-24 h-24 rounded-md shadow-md overflow-hidden bg-cover"
                            style={{
                              backgroundImage: `url(${IMGS_CDN}/bg_${todo[0].r}star.png)`,
                            }}
                          >
                            <img
                              draggable="false"
                              height="96"
                              width="96"
                              src={getUrl(
                                todo[1] === "character"
                                  ? `/characters/${todo[0].id}/${todo[0].id}_portrait.png`
                                  : `/weapons/${todo[0].id}.png`,
                                96,
                                96
                              )}
                              alt={todo[0].name}
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col h-full justify-center">
                          <div className="flex flex-col">
                            <div className="flex w-36">
                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {t({
                                    id: "levels",
                                    defaultMessage: "Levels",
                                  })}
                                </h4>
                                <div className="flex justify-center text-sm">
                                  <div>
                                    <p>{todo[2][0]}</p>
                                  </div>
                                  <div>
                                    <CgArrowLongRight className="h-full mx-2" />
                                  </div>
                                  <div className="inline-flex justify-center items-center">
                                    <p>{todo[2][2]}</p>
                                    <img
                                      src={getUrl(`/ascension.png`, 16, 16)}
                                      className={clsx("ml-1 w-3 h-3", {
                                        "opacity-100": todo[2][3],
                                        "opacity-0": !todo[2][3],
                                      })}
                                      alt="ascension"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {Object.keys(todo[3]).length > 0 && (
                            <div className="flex flex-col mt-2">
                              <h4 className="text-sm font-semibold text-white">
                                {t({
                                  id: "talents",
                                  defaultMessage: "Talents",
                                })}
                              </h4>
                              <div className="flex">
                                <div>
                                  {Object.entries(todo[3]).map(
                                    ([id, value]) => (
                                      <div key={id} className="flex">
                                        <div className="flex justify-center text-xs">
                                          <div>
                                            <p>{value[0]}</p>
                                          </div>
                                          <div>
                                            <CgArrowLongRight className="h-full mx-2" />
                                          </div>
                                          <div>
                                            <p>{value[1]}</p>
                                          </div>
                                        </div>
                                        <div className="ml-2 text-xs text-gray-500">
                                          {t({ id: id, defaultMessage: id })}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center flex-wrap">
                        {Object.entries(todo[4]).map(([id, data]) => (
                          <ItemPopover
                            key={id}
                            id={id}
                            data={data}
                            originalData={todo[5][id]}
                            handleOnChange={(newValues) =>
                              updateTodoResourcesById(todo[0].id, newValues)
                            }
                            materialInfo={materialsMap[id]}
                          />
                        ))}
                      </div>

                      <div className="flex justify-between mx-2">
                        <span className="text-lg text-white">#{i + 1}</span>
                        <Button
                          className=""
                          onClick={() => removeTodo(todo[0].id)}
                        >
                          X{" "}
                          {t({
                            id: "delete",
                            defaultMessage: "Delete",
                          })}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
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
