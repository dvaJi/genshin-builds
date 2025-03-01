import { memo } from "react";
import { HiOutlineCalendarDays, HiOutlineCheck } from "react-icons/hi2";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import useIntl from "@hooks/use-intl";

import ItemPopoverSummary from "./ItemPopoverSummary";

type Props = {
  farmToday: Record<string, number>;
  currentDay: string;
  setCurrentDay: (day: string) => void;
  originalSummary: Record<string, number>;
  todoIdsByResource: Record<string, any[]>;
  updateAllTodoResourcesById: (newData: any) => void;
  materialsMap: Record<string, any>;
  days: string[];
};

function TodoFarmTodayList({
  farmToday,
  currentDay,
  setCurrentDay,
  originalSummary,
  todoIdsByResource,
  updateAllTodoResourcesById,
  materialsMap,
  days,
}: Props) {
  const { t } = useIntl("todo");
  const hasMaterialsToFarm = Object.keys(farmToday).length > 0;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <HiOutlineCalendarDays className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            {t({
              id: "farm_today",
              defaultMessage: "Farm today",
            })}
          </h2>
        </div>
        <Select onValueChange={setCurrentDay} defaultValue={currentDay}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4">
        {!hasMaterialsToFarm ? (
          <EmptyFarmToday />
        ) : (
          <FarmTodayList
            farmToday={farmToday}
            originalSummary={originalSummary}
            todoIdsByResource={todoIdsByResource}
            updateAllTodoResourcesById={updateAllTodoResourcesById}
            materialsMap={materialsMap}
          />
        )}
      </div>
    </div>
  );
}

// Empty Farm Today component
const EmptyFarmToday = memo(() => {
  const { t } = useIntl("todo");

  return (
    <div className="flex items-center justify-center rounded-lg bg-muted/30 p-4 text-center text-sm text-muted-foreground">
      <span>
        {t({
          id: "nothing_today",
          defaultMessage: "Nothing to farm today!",
        })}
      </span>
      <HiOutlineCheck className="ml-2 h-4 w-4" />
    </div>
  );
});
EmptyFarmToday.displayName = "EmptyFarmToday";

// Farm Today list component
const FarmTodayList = memo(
  ({
    farmToday,
    originalSummary,
    todoIdsByResource,
    updateAllTodoResourcesById,
    materialsMap,
  }: {
    farmToday: Record<string, number>;
    originalSummary: Record<string, number>;
    todoIdsByResource: Record<string, any[]>;
    updateAllTodoResourcesById: (newData: any) => void;
    materialsMap: Record<string, any>;
  }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2">
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
    );
  },
);
FarmTodayList.displayName = "FarmTodayList";

export default memo(TodoFarmTodayList, (prevProps, nextProps) => {
  // Custom equality check for better performance
  const farmTodayKeysEqual =
    Object.keys(prevProps.farmToday).length ===
    Object.keys(nextProps.farmToday).length;
  if (!farmTodayKeysEqual) return false;

  // Check if current day changed
  if (prevProps.currentDay !== nextProps.currentDay) return false;

  // Check if the farm today data actually changed
  for (const key in prevProps.farmToday) {
    if (prevProps.farmToday[key] !== nextProps.farmToday[key]) {
      return false;
    }
  }

  return true;
});
