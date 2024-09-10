export interface BuildWeapon {
  id: string;
  r: number;
}

interface SetsStats {
  flower: string[];
  plume: string[];
  sands: string[];
  goblet: string[];
  circlet: string[];
}

export type CharBuild = {
  id: string;
  name: string;
  description: string;
  role: string;
  recommended: boolean;
  weapons: BuildWeapon[];
  sets: string[][];
  stats_priority: string[];
  stats: SetsStats;
  talent_priority: string[];
  build_notes: string;
};

export interface Build {
  id: string;
  notes: string;
  builds: CharBuild[];
}

export type MostUsedBuild = {
  weapons: string[];
  artifacts: string[][];
};
