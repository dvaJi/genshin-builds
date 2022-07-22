export interface BuildSet {
  choose?: boolean;
  set_1: string;
  set_2?: string;
  set_3?: string;
  set_4?: string;
  set_5?: string;
  set_6?: string;
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
