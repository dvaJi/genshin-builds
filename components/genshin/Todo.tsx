import { useMemo, useCallback, useState } from "react";
import format from "date-fns/format";
import Link from "next/link";
import clsx from "clsx";
import {
  CgArrowLongRight,
  CgChevronRight,
  CgChevronLeft,
} from "react-icons/cg";

import Button from "@components/ui/Button";
import ItemPopover from "@components/genshin/ItemPopover";
import ItemPopoverSummary from "@components/genshin/ItemPopoverSummary";
import Select from "@components/Select";

import useIntl from "@hooks/use-intl";
import { IMGS_CDN } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { Todo, todos as todosAtom } from "@state/todo";
import { trackClick } from "@lib/gtag";
import { useStore } from "@nanostores/react";

type Props = {
  planning: Record<string, any>;
  materialsMap: Record<string, any>;
  days: string[];
};

const TodoList = ({ materialsMap, planning, days }: Props) => {
  const todos = useStore(todosAtom);
  const [currentDay, setCurrentDay] = useState(
    days[Number(format(new Date(), "i")) - 1]
  );
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
            mat?.type === "talent_lvl_up_materials" && mat.rarity === 5;
          if (
            id !== "crown_of_insight" &&
            ["talent_lvl_up_materials", "weapon_primary_materials"].includes(
              mat?.type
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
      trackClick("todo_remove_todo");
      todosAtom.set(todos.filter((todo) => todo[0].id !== id));
    },
    [todos]
  );

  const moveTodo = useCallback(
    (id: string, index: number, newIndex: number) => {
      trackClick("todo_move_todo");
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
      // trackClick("todo_update_todo_byid");
      const todo = todos.find((todo) => todo[0].id === id);
      if (todo) {
        todo[4] = { ...todo[4], [newData.id]: newData.value };
        console.log(
          "updateTodoResourcesById",
          id,
          newData,
          todo[4][newData.id]
        );

        const newTodos = [...todos].filter((todo) => todo[0].id !== id);
        newTodos.push(todo);

        todosAtom.set(newTodos);
      }
    },
    [todos]
  );

  const updateAllTodoResourcesById = useCallback(
    (newData: any) => {
      trackClick("todo_update_todo_all");
      const { idsByResource, remainingById } = newData;
      // console.log(idsByResource, remainingById);

      const modifiedTodos: Todo[] = [];
      idsByResource.forEach((data: any, index: number) => {
        const todo = todos[data[3]];
        todo[4][newData.id] = remainingById[index];
        console.log(
          "updateAllTodoResourcesById",
          newData.id,
          todo[4][newData.id]
        );
        modifiedTodos.push(todo);
      });

      const newTodos = [...todos].filter(
        (todo) =>
          !modifiedTodos.find(
            (modifiedTodo) => modifiedTodo[0].id === todo[0].id
          )
      );
      // console.log(newTodos, modifiedTodos);

      todosAtom.set([...newTodos, ...modifiedTodos]);
    },
    [todos]
  );

  return (
    <div>
      {todos.length > 0 ? (
        <div className="inline-grid grid-cols-1 lg:grid-cols-4">
          <div className="">
            <div>
              <div className="relative z-50 flex">
                <h1 className="p-2 text-lg font-semibold text-white">
                  {t({
                    id: "farm_today",
                    defaultMessage: "Farm today",
                  })}
                </h1>
                <Select
                  selectedIconRender={() => null}
                  onChange={(e) => setCurrentDay(e.name)}
                  options={days.map((day) => ({ value: day, name: day }))}
                  itemsListRender={(items) => <>{items.name}</>}
                />
              </div>
              <div className="card flex flex-wrap justify-center">
                {Object.keys(farmToday).length === 0 ? (
                  <div>Nothing to farm today!</div>
                ) : (
                  Object.entries(farmToday).map(([id, data]) => (
                    <ItemPopoverSummary
                      key={id}
                      id={id}
                      data={data}
                      originalData={originalSummary[id]}
                      idsByResource={todoIdsByResource[id]}
                      handleOnChange={updateAllTodoResourcesById}
                      materialInfo={materialsMap[id]}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="card w-full">
              <h1 className="p-2 text-lg font-semibold text-white">
                {t({
                  id: "summary",
                  defaultMessage: "Summary",
                })}
              </h1>
              <div className="flex flex-wrap justify-center">
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
          <div className="col-span-3 m-3 inline-grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {todos.map((todo, i) => (
              <div key={todo[0].id + i} className="card flex h-full w-full p-0">
                <div className="relative flex w-full flex-shrink-0 flex-col">
                  <div className="mx-2 flex justify-between p-2">
                    <p className="text-lg font-semibold text-white">
                      {todo[0].name}
                    </p>
                    <div>
                      <button
                        onClick={() => moveTodo(todo[0].id, i, i - 1)}
                        disabled={i === 0}
                        className="rounded-none rounded-l-xl border-2 border-white border-opacity-10 px-1 py-1 text-white transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:border-gray-600 disabled:opacity-50"
                      >
                        <CgChevronLeft />
                      </button>
                      <button
                        onClick={() => moveTodo(todo[0].id, i, i + 1)}
                        disabled={i + 1 === todos.length}
                        className="rounded-none rounded-r-xl border-2 border-white border-opacity-10 px-1 py-1 text-white transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:border-gray-600 disabled:opacity-50"
                      >
                        <CgChevronRight />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col justify-between p-2">
                    <div className="mb-2 flex min-h-[104px] items-center justify-between">
                      <div className="ml-2 flex justify-center">
                        <div
                          className="h-24 w-24 overflow-hidden rounded-md bg-cover shadow-md"
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
                            className="h-auto w-full"
                          />
                        </div>
                      </div>
                      <div className="flex h-full flex-col justify-center">
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
                                  <CgArrowLongRight className="mx-2 h-full" />
                                </div>
                                <div className="inline-flex items-center justify-center">
                                  <p>{todo[2][2]}</p>
                                  <img
                                    src={getUrl(`/ascension.png`, 16, 16)}
                                    className={clsx("ml-1 h-3 w-3", {
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
                          <div className="mt-2 flex flex-col">
                            <h4 className="text-sm font-semibold text-white">
                              {t({
                                id: "talents",
                                defaultMessage: "Talents",
                              })}
                            </h4>
                            <div className="flex">
                              <div>
                                {Object.entries(todo[3]).map(([id, value]) => (
                                  <div key={id} className="flex">
                                    <div className="flex justify-center text-xs">
                                      <div>
                                        <p>{value[0]}</p>
                                      </div>
                                      <div>
                                        <CgArrowLongRight className="mx-2 h-full" />
                                      </div>
                                      <div>
                                        <p>{value[1]}</p>
                                      </div>
                                    </div>
                                    <div className="ml-2 text-xs text-gray-500">
                                      {t({ id: id, defaultMessage: id })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center">
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

                    <div className="mx-2 flex justify-between">
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
      ) : (
        <div className="w-72 rounded border border-vulcan-900 bg-vulcan-800 p-4">
          <p>
            {t({
              id: "no_todo_msg",
              defaultMessage: "No Todos. Add some from the calculator.",
            })}
          </p>
          <p>
            <Link
              href="/calculator"
              className="text-slate-300 hover:text-white"
            >
              {t({
                id: "go_to_calculator",
                defaultMessage: "Go to Calculator page",
              })}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
