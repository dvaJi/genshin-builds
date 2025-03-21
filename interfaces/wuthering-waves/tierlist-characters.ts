export interface TierlistCharacters {
  overall: MainDps;
  mainDPS: MainDps;
  subDPS: MainDps;
  support: MainDps;
  explanations: Record<string, string>;
}

export interface MainDps {
  SS: string[];
  S: string[];
  A: string[];
  B: string[];
  C?: string[];
}
