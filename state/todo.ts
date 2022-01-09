import { persistentAtom } from "@nanostores/persistent";
import { computed } from "nanostores";

type ID = { id: string; name: string; r: number };
type Type = string;
type Current = number;
type Intended = number;
type CurrentAscension = boolean;
type IntendedAscension = boolean;
type Level = [Current, CurrentAscension, Intended, IntendedAscension];
type Stats = {
  normal_attack?: [Current, Intended];
  skill?: [Current, Intended];
  burst?: [Current, Intended];
};
export type Resources = { [id: string]: number };
type ResourcesOriginal = { [id: string]: number };
export type Todo = [ID, Type, Level, Stats, Resources, ResourcesOriginal];

export const todos = persistentAtom<Todo[]>("todo", [], {
  encode(value) {
    return JSON.stringify(value);
  },
  decode(value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  },
});

export const getSummary = computed(todos, (list: Todo[]) => {
  const summary: Record<string, number> = {};
  const originalSummary: Record<string, number> = {};

  list.forEach((todo) => {
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
});
