import { CSSProperties } from "react";
import { atom } from "recoil";

interface AppBackgroundStyle {
  image?: string;
  gradient: CSSProperties;
}

export const appBackgroundStyleState = atom<AppBackgroundStyle>({
  key: "appBackgroundStyle",
  default: {
    image: undefined,
    gradient: {
      // background:
      //   "linear-gradient(rgba(27,22,53,.8),#1f183a 620px),radial-gradient(at center top,rgba(28,22,54,0) 60%,#1f183a 80%)",
    },
  },
});
