import { persistentAtom } from "@nanostores/persistent";

export type AchievementsCompleted = {
  ids: number[];
};

export const $achievements = persistentAtom<AchievementsCompleted>(
  "hsr-achievements",
  {
    ids: [],
  },
  {
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
  },
);
