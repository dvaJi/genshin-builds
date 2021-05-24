export interface CharacterTier {
  id: string;
  w_id: string;
  min_c: number;
}

export type TierNums = "0" | "1" | "2" | "3" | "4";

interface Tier {
  "0": CharacterTier[];
  "1": CharacterTier[];
  "2": CharacterTier[];
  "3": CharacterTier[];
  "4": CharacterTier[];
}

export enum Roles {
  maindps = "maindps",
  subdps = "subdps",
  support = "support",
}

export type Tierlist = Record<Roles, Tier>;
