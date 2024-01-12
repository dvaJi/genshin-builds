export interface Tierlist {
  overall: Overall;
  single: Overall;
  aoe: Overall;
  support: Overall;
}

export interface Overall {
  "SS ": string[];
  "S ": string[];
  "A ": string[];
  "B ": string[];
  "C ": string[];
}
