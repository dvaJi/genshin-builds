import { persistentAtom } from "@nanostores/persistent";

export type AchievementsCompleted = {
  [id: number]: number[];
};

export const achievementsCompleted = persistentAtom<AchievementsCompleted>(
  "achievements",
  {},
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
  }
);
