import { memo } from "react";

import useIntl from "@hooks/use-intl";

type Props = {
  progressPercentage: number;
  todosLength: number;
};

function TodoTotalProgress({ progressPercentage, todosLength }: Props) {
  const { t } = useIntl("todo");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t({ id: "todo_title", defaultMessage: "Todo List" })}
        </h1>
        <div className="flex items-center space-x-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          <span>{todosLength}</span>
          <span className="text-muted-foreground">
            {todosLength === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-card p-2 shadow-sm">
        <div className="relative h-2 w-36 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {progressPercentage}%{" "}
          {t({ id: "complete", defaultMessage: "complete" })}
        </span>
      </div>
    </div>
  );
}

export default memo(TodoTotalProgress);
