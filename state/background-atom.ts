import { atom } from "nanostores";
import { CSSProperties } from "react";

export interface AppBackgroundStyle {
  image?: string;
  stickyImage?: string;
  gradient: CSSProperties;
}

export const background = atom<AppBackgroundStyle>({
  image: undefined,
  gradient: {
    // background:
    //   "linear-gradient(rgba(27,22,53,.8),#1f183a 620px),radial-gradient(at center top,rgba(28,22,54,0) 60%,#1f183a 80%)",
  },
});

export function setBackground(bg: AppBackgroundStyle) {
  background.set(bg);
}
