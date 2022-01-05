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
type Resources = { [id: string]: [number, string, number] };
type ResourcesOriginal = { [id: string]: [number, string, number] };
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
  return list.reduce<any>((acc, value) => {
    for (const [id, data] of Object.entries(value[4])) {
      // if (!isSunday && itemList[id].day && itemList[id].day.includes(today)) {
      //   if (todayOnly[id] === undefined) {
      //     todayOnly[id] = 0;
      //   }
      //   todayOnly[id] += amount;
      // }
      if (acc[id] === undefined) {
        console.log(data);
        acc[id] = [0, data[1], data[2]];
      }
      acc[id][0] += data[0];
    }
    return acc;
  }, {});
});

export const getSummaryOriginal = computed(todos, (list: Todo[]) => {
  return list.reduce<any>((acc, value) => {
    for (const [id, data] of Object.entries(value[5])) {
      // if (!isSunday && itemList[id].day && itemList[id].day.includes(today)) {
      //   if (todayOnly[id] === undefined) {
      //     todayOnly[id] = 0;
      //   }
      //   todayOnly[id] += amount;
      // }
      if (acc[id] === undefined) {
        console.log(data);
        acc[id] = [0, data[1], data[2]];
      }
      acc[id][0] += data[0];
    }
    return acc;
  }, {});
});
