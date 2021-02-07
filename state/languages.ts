import { atom } from "recoil";

export const languageState = atom<Record<string, string>>({
  key: "language",
  default: {},
});

