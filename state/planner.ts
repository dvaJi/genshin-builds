import { recoilPersist } from "@lib/recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist();

export interface Planner {
  characters: string[];
  weapons: string[];
}

export const planner = atom<Planner>({
  key: "compBuild",
  default: {
    characters: [],
    weapons: [],
  },
  effects_UNSTABLE: [persistAtom],
});
