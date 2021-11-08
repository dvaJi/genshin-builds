export interface BuildSet {
  set_1: string;
  set_2?: string;
}

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

export interface Build {
  id: string;
  name: string;
  description: string;
  role: string;
  recommended: boolean;
  weapons: BuildWeapon[];
  sets: BuildSet[];
  stats_priority: string[];
  stats: SetsStats;
  talent_priority: string[];
}

export type MostUsedBuild = {
  weapons: string[];
  artifacts: string[][];
};
