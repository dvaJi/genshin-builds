export interface WEngines {
  _id: number;
  id: string;
  codename: string;
  name: string;
  description: string;
  shortDescription: string;
  rarity: number;
  icon: string;
  materials: string;
  talents: Talent[];
}

export interface Talent {
  name: string;
  level: number;
  description: string;
}
