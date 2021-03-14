interface BuildSet {
  set_1: {
    id: string;
    name: string;
  };
  set_2?: {
    id: string;
    name: string;
  };
  order: number;
}

interface BuildWeapon {
  id: string;
  name: string;
  order: number;
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
  weapons: BuildWeapon[];
  sets: BuildSet[];
  stats_priority: string[];
  stats: SetsStats;
}
