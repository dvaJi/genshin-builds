import { atom } from "recoil";
import { ElementalResonance } from "../interfaces/elemental-resonance";

export interface CharacterBuild {
  i: string; // character id
  w: string; // weapon
  a: string[]; // artifacts
}

export const elementalResonancesState = atom<ElementalResonance[]>({
  key: "elementalResonances",
  default: [],
});

export const compBuildState = atom<Record<string, CharacterBuild>>({
  key: "compBuild",
  default: {
    "1": { i: "", w: "", a: [] },
    "2": { i: "", w: "", a: [] },
    "3": { i: "", w: "", a: [] },
    "4": { i: "", w: "", a: [] },
  },
});
