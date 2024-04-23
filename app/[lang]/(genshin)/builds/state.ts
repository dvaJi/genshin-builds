import { atom } from "nanostores";

type Filter = {
  search: string;
  elements: string[];
};

export const $filters = atom<Filter>({
  search: "",
  elements: [],
});
