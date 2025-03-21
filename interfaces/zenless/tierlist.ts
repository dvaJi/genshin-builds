export interface ZZZTierlist {
  overall: Tiers;
  dps: Tiers;
  debuffer: Tiers;
  supporter: Tiers;
  explanations: Record<string, string>;
}

export interface Tiers {
  "Tier 0": string[];
  "Tier 1": string[];
  "Tier 2": string[];
  "Tier 3": string[];
  "Tier 4"?: string[];
}
