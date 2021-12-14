import { persistentAtom } from "@nanostores/persistent";

type ID = { id: string; name: string };
type Type = string;
type Current = number;
type Intended = number;
type Level = [Current, Intended];
type Stats = {
  aa?: [Current, Intended];
  skill?: [Current, Intended];
  burst?: [Current, Intended];
};
type Resources = { [id: string]: [number, string, number] };
export type Todo = [ID, Type, Level, Stats, Resources[]];

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
