export interface Weapons {
  _id: number;
  id: string;
  name: string;
  description: string;
  effect: string;
  effectName: string;
  effectParams: Array<string[]>;
  rarity: number;
  type: Type;
  icon: string;
  stats: { [key: string]: { [key: string]: Stat[] } };
  ascensions: Array<Ascension[]>;
}

export interface Ascension {
  _id: number;
  id: string;
  name: string;
  icon: string;
  rarity: number;
  value: number;
}

export interface Stat {
  Name: Name;
  Value: number;
  IsRatio: boolean;
  IsPercent: boolean;
}

export enum Name {
  Atk = "ATK",
  CritDMG = "Crit. DMG",
  CritRate = "Crit. Rate",
  Def = "DEF",
  EnergyRegen = "Energy Regen",
  HP = "HP",
}

export interface Type {
  id: number;
  name: NameEnum;
}

export enum NameEnum {
  Broadblade = "Broadblade",
  Gauntlets = "Gauntlets",
  Pistols = "Pistols",
  Rectifier = "Rectifier",
  Sword = "Sword",
}
