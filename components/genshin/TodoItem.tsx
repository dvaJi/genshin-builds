import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

import { Button } from "@app/components/ui/button";
import { cn } from "@app/lib/utils";
import type { Todo } from "@state/todo";

import Image from "./Image";
import TodoItemLevels from "./TodoItemLevels";
import TodoItemResources from "./TodoItemResources";
import TodoItemTalents from "./TodoItemTalents";

const TodoItem = ({
  todo,
  index,
  totalLength,
  moveTodo,
  removeTodo,
  updateTodoResourcesById,
  materialsMap,
}: {
  todo: Todo;
  index: number;
  totalLength: number;
  moveTodo: (id: string, index: number, newIndex: number) => void;
  removeTodo: (id: string) => void;
  updateTodoResourcesById: (id: string, newData: any) => void;
  materialsMap: Record<string, any>;
}) => {
  const t = useTranslations("Genshin.todo");

  // Extract the todo ID for dependency arrays
  const todoId = todo[0].id;

  // Memoize the update handler to prevent recreation
  const handleUpdateResources = useCallback(
    (newValues: any) => {
      updateTodoResourcesById(todoId, newValues);
    },
    [updateTodoResourcesById, todoId],
  );

  // Memoize the move handlers to prevent recreation
  const handleMoveUp = useCallback(() => {
    const targetIndex = index - 1;
    moveTodo(todoId, index, targetIndex);
  }, [moveTodo, todoId, index]);

  const handleMoveDown = useCallback(() => {
    const targetIndex = index + 1;
    moveTodo(todoId, index, targetIndex);
  }, [moveTodo, todoId, index]);

  // Memoize the delete handler to prevent recreation
  const handleDelete = useCallback(() => {
    removeTodo(todoId);
  }, [removeTodo, todoId]);

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-4 py-3">
          <h3 className="truncate font-medium text-foreground">
            {todo[0].name}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={handleMoveUp}
              disabled={index === 0}
              className="rounded border border-border bg-secondary p-1 text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
              aria-label="Move up"
            >
              <CgChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleMoveDown}
              disabled={index + 1 === totalLength}
              className="rounded border border-border bg-secondary p-1 text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
              aria-label="Move down"
            >
              <CgChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-grow flex-col p-4">
          <div className="mb-4 flex items-center">
            <div className="relative mr-4 flex-shrink-0">
              <div
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-lg bg-cover shadow-md",
                  `genshin-bg-rarity-${todo[0].r}`,
                )}
              >
                <Image
                  draggable="false"
                  height="80"
                  width="80"
                  src={
                    todo[1] === "character"
                      ? `/characters/${todo[0].id}/image.png`
                      : `/weapons/${todo[0].id}.png`
                  }
                  alt={todo[0].name}
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                #{index + 1}
              </div>
            </div>
            <div className="space-y-2">
              <TodoItemLevels levels={todo[2]} />
              <TodoItemTalents talents={todo[3]} />
            </div>
          </div>

          <TodoItemResources
            resources={todo[4]}
            originalResources={todo[5]}
            updateTodoResourcesById={handleUpdateResources}
            materialInfo={materialsMap}
          />

          <div className="mt-auto pt-2">
            <Button
              onClick={handleDelete}
              className="w-full justify-center bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TodoItem, (prevProps, nextProps) => {
  // Custom equality check for better performance
  // If the todo ID is different, always re-render
  if (prevProps.todo[0].id !== nextProps.todo[0].id) return false;

  // If the index changed, we need to re-render
  if (prevProps.index !== nextProps.index) return false;

  // If the totalLength changed, we might need to re-render
  // (e.g., to disable/enable the move down button)
  if (
    prevProps.totalLength !== nextProps.totalLength &&
    (prevProps.index === prevProps.totalLength - 1 ||
      nextProps.index === nextProps.totalLength - 1)
  ) {
    return false;
  }

  // Check resources for changes
  const prevResources = prevProps.todo[4];
  const nextResources = nextProps.todo[4];
  const resourceKeysMatch =
    Object.keys(prevResources).length === Object.keys(nextResources).length;
  if (!resourceKeysMatch) return false;

  for (const key in prevResources) {
    if (prevResources[key] !== nextResources[key]) {
      return false;
    }
  }

  return true;
});
