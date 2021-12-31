import { persistentAtom } from "@nanostores/persistent";

type ID = { id: string; name: string, r: number };
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
export type Todo = [ID, Type, Level, Stats, Resources[], ResourcesOriginal[]];

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
