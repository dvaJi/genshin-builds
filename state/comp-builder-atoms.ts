import { atom } from "recoil";

export interface CharacterBuild {
  w: string;
  a: string[];
}

export const compBuildState = atom<Record<string, CharacterBuild>>({
  key: "compBuild",
  default: {},
});
