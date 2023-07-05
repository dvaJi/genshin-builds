export interface Tierlist {
  overall: Overall;
  dps: Dps;
  support: Overall;
}

export interface Dps {
  "SS ": A;
  "S ": A;
  "A ": A;
  "B ": A;
  "C ": C;
}

export interface A {
  single_target: string[];
  aoe: string[];
}

export interface C {
  single_target: string[];
}

export interface Overall {
  "SS ": string[];
  "S ": string[];
  "A ": string[];
  "B ": string[];
  "C ": string[];
}
