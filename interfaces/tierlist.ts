export interface CharacterTier {
  id: string;
  w_id: string;
  min_c: number;
}

export type TierNums = "0" | "1" | "2" | "3" | "4";

interface Tier<T> {
  "0": T[];
  "1": T[];
  "2": T[];
  "3": T[];
  "4": T[];
}

export enum Roles {
  maindps = "maindps",
  subdps = "subdps",
  support = "support",
}

export type Tierlist = Record<Roles, Tier<CharacterTier>>;
export type TierlistWeapons = Record<Roles, Tier<string>>;
