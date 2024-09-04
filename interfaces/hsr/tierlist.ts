export interface Tierlist {
  overall: Tiers;
  single: Tiers;
  aoe: Tiers;
  support: Tiers;
}

export interface Tiers {
  "SS ": string[];
  "S ": string[];
  "A ": string[];
  "B ": string[];
  "C ": string[];
}
