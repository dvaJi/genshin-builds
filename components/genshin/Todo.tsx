"use client";

import Link from "next/link";
import { memo, useCallback, useMemo, useState } from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { IoAnalyticsOutline } from "react-icons/io5";

import ItemPopoverSummary from "@components/genshin/ItemPopoverSummary";
import useIntl from "@hooks/use-intl";
import { trackClick } from "@lib/gtag";
import { useStore } from "@nanostores/react";
import { Todo, todos as todosAtom } from "@state/todo";

import TodoFarmTodayList from "./TodoFarmTodayList";
import TodoItem from "./TodoItem";
import TodoTotalProgress from "./TodoTotalProgress";

type Props = {
  planning: Record<string, any>;
  materialsMap: Record<string, any>;
  days: string[];
};

// Empty state component
const EmptyTodoState = memo(({ locale }: { locale: string }) => {
  const { t } = useIntl("todo");

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border bg-card/50 p-8 text-center shadow-sm backdrop-blur-sm">
      <div className="mb-4 rounded-full bg-muted p-4">
        <HiOutlineCalendarDays className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-medium text-foreground">
        {t({
          id: "no_todo_title",
          defaultMessage: "No todos yet",
        })}
      </h3>
      <p className="mb-4 max-w-md text-muted-foreground">
        {t({
          id: "no_todo_msg",
          defaultMessage: "No Todos. Add some from the calculator.",
        })}
      </p>
      <Link
        href={`/${locale}/calculator`}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        prefetch={false}
      >
        {t({
          id: "go_to_calculator",
          defaultMessage: "Go to Calculator page",
        })}
      </Link>
    </div>
  );
});
EmptyTodoState.displayName = "EmptyTodoState";

// Summary section component
const SummarySection = memo(
  ({
    summary,
    originalSummary,
    todoIdsByResource,
    updateAllTodoResourcesById,
    materialsMap,
  }: {
    summary: Record<string, number>;
    originalSummary: Record<string, number>;
    todoIdsByResource: Record<string, any[]>;
    updateAllTodoResourcesById: (newData: any) => void;
    materialsMap: Record<string, any>;
  }) => {
    const { t } = useIntl("todo");

    return (
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <IoAnalyticsOutline className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            {t({
              id: "summary",
              defaultMessage: "Summary",
            })}
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap justify-center gap-2">
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
    );
  },
  (prevProps, nextProps) => {
    // Custom equality check for better performance
    const summaryKeysEqual =
      Object.keys(prevProps.summary).length ===
      Object.keys(nextProps.summary).length;
    if (!summaryKeysEqual) return false;

    // Check if any summary values have changed
    for (const key in prevProps.summary) {
      if (prevProps.summary[key] !== nextProps.summary[key]) {
        return false;
      }
    }

    return true;
  },
);
SummarySection.displayName = "SummarySection";

// TodoList container component
const TodoListContainer = memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      </div>
    );
  },
);
TodoListContainer.displayName = "TodoListContainer";

// Main component
const TodoList = ({ materialsMap, planning, days }: Props) => {
  const todos = useStore(todosAtom);
  const [currentDay, setCurrentDay] = useState(days[new Date().getDay()]);
  const { locale } = useIntl("todo");

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
      // Check if the item should be included in today's farming
      const shouldIncludeItem =
        isSunday || planning[currentDay].includes(value[0].id);

      if (shouldIncludeItem) {
        for (const [id, data] of Object.entries(value[4])) {
          const mat = materialsMap[id];
          // Extract these complex checks to separate variables
          const isTalentOrWeaponMaterial = [
            "talent_lvl_up_materials",
            "weapon_primary_materials",
          ].includes(mat?.type);
          const isWeeklyBoss =
            mat?.type === "talent_lvl_up_materials" && mat.rarity === 5;
          const isCrownOfInsight = id === "crown_of_insight";

          if (!isCrownOfInsight && isTalentOrWeaponMaterial && !isWeeklyBoss) {
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

  // Memoize all the callback functions to prevent unnecessary re-renders
  const removeTodo = useCallback(
    (id: string) => {
      trackClick("todo_remove_todo");
      todosAtom.set(todos.filter((todo) => todo[0].id !== id));
    },
    [todos],
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
    [todos],
  );

  const updateTodoResourcesById = useCallback(
    (id: string, newData: any) => {
      const todo = todos.find((todo) => todo[0].id === id);
      if (todo) {
        todo[4] = { ...todo[4], [newData.id]: newData.value };

        const newTodos = [...todos].map((oldtodo) => {
          if (oldtodo[0].id === id) {
            return todo;
          }
          return oldtodo;
        });

        todosAtom.set(newTodos);
      }
    },
    [todos],
  );

  // This function is passed to many components and was recreated too often
  // Memoize it with a stable reference
  const updateAllTodoResourcesById = useCallback(
    (newData: any) => {
      trackClick("todo_update_todo_all");
      const { idsByResource, remainingById } = newData;

      const modifiedTodos: Todo[] = [];
      idsByResource.forEach((data: any, index: number) => {
        const todoIndex = data[3];
        const todo = todos[todoIndex];
        if (todo) {
          todo[4][newData.id] = remainingById[index];
          modifiedTodos.push(todo);
        }
      });

      // Only update todos if there are modifications
      if (modifiedTodos.length > 0) {
        const newTodos = [...todos].map((todo) => {
          const modifiedTodo = modifiedTodos.find(
            (t) => t[0].id === todo[0].id,
          );
          return modifiedTodo || todo;
        });

        todosAtom.set(newTodos);
      }
    },
    [todos],
  );

  const progressPercentage = useMemo(() => {
    if (Object.keys(originalSummary).length === 0) return 0;

    const totalNeeded = Object.entries(originalSummary).reduce(
      (a, [key, value]) => {
        if (key === "mora") return a / 100;
        return a + value;
      },
      0,
    );
    const totalCompleted = Object.entries(summary).reduce((a, [key, value]) => {
      if (key === "mora") return a / 100;
      return a + value;
    }, 0);

    const current = totalNeeded - totalCompleted;
    return Math.floor((current / totalNeeded) * 100);
  }, [summary, originalSummary]);

  const handleDayChange = useCallback((day: string) => {
    setCurrentDay(day);
  }, []);

  if (todos.length === 0) {
    return <EmptyTodoState locale={locale} />;
  }

  return (
    <div className="space-y-6">
      <TodoTotalProgress
        progressPercentage={progressPercentage}
        todosLength={todos.length}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <TodoFarmTodayList
              farmToday={farmToday}
              currentDay={currentDay}
              setCurrentDay={handleDayChange}
              originalSummary={originalSummary}
              todoIdsByResource={todoIdsByResource}
              updateAllTodoResourcesById={updateAllTodoResourcesById}
              materialsMap={materialsMap}
              days={days}
            />

            <SummarySection
              summary={summary}
              originalSummary={originalSummary}
              todoIdsByResource={todoIdsByResource}
              updateAllTodoResourcesById={updateAllTodoResourcesById}
              materialsMap={materialsMap}
            />
          </div>
        </div>

        <TodoListContainer>
          {todos.map((todo, i) => (
            <TodoItem
              key={todo[0].id + i}
              todo={todo}
              index={i}
              totalLength={todos.length}
              moveTodo={moveTodo}
              removeTodo={removeTodo}
              updateTodoResourcesById={updateTodoResourcesById}
              materialsMap={materialsMap}
            />
          ))}
        </TodoListContainer>
      </div>
    </div>
  );
};

export default TodoList;
