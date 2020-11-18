import { atom } from "recoil";

export interface CharacterBuild {
  i: string;
  w: string;
  a: string[];
}

export const compBuildState = atom<Record<string, CharacterBuild>>({
  key: "compBuild",
  default: {
    "1": { i: "", w: "", a: [] },
    "2": { i: "", w: "", a: [] },
    "3": { i: "", w: "", a: [] },
    "4": { i: "", w: "", a: [] },
  },
});
