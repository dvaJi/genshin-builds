export interface TierlistEchoes {
  tiers: Tiers;
  explanations: Explanations;
}

export interface Explanations {
  dreamless: string;
  inferno_rider: string;
  crownless: string;
  mech_abomination: string;
  thundering_mephis: string;
  impermanence_heron: string;
  chasm_guardian: string;
}

export interface Tiers {
  SS: string[];
  S: string[];
  A: string[];
}
