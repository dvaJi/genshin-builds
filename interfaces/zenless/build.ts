export interface Builds {
  id: string;
  builds: Build[];
  teams: Team[];
  wEngines: WEngines;
  drivediscs: Drivediscs;
  talentsPriority: TalentsPriority;
}

export interface Build {
  name: string;
  overview: string;
  "w-engines": string[];
  "drive-disc": DriveDisc[];
  "main-stats": { [key: string]: Array<Stat[]> };
  "sub-stats": Array<Stat[]>;
}

export interface DriveDisc {
  name: string;
  pieces: number;
}

export enum Stat {
  AnomalyMastery = "Anomaly Mastery",
  AnomalyProficiency = "Anomaly Proficiency",
  Atk = "ATK",
  CRITRate = "CRIT Rate",
  CritDmg = "CRIT DMG",
  Def = "DEF",
  ElectricDMGBonus = "Electric DMG Bonus",
  EnergyRegen = "Energy Regen",
  EtherDMGBonus = "Ether DMG Bonus",
  FireDMGBonus = "Fire DMG Bonus",
  IceDMGBonus = "Ice DMG Bonus",
  Impact = "Impact",
  ImpactReduction = "Impact Reduction",
  PENRatio = "PEN Ratio",
  Pen = "PEN",
  PercentATK = "Percent ATK",
  PhysicalDMGBonus = "Physical DMG Bonus",
}

export interface Drivediscs {
  bestDriveDiscs: BestDriveDisc[];
  notes: string;
}

export interface BestDriveDisc {
  sets: Set[];
  rating: number;
  note: string;
}

export interface Set {
  name: string;
  pcs: number;
}

export interface TalentsPriority {
  notes: string;
  core_skill: Assist;
  basic_attack: Assist;
  dodge: Assist;
  assist: Assist;
  special_attack: Assist;
  chain_attack: Assist;
}

export interface Assist {
  priority: number;
  explanation: string;
}

export interface Team {
  name: string;
  overview: string;
  character_1: Character1;
  character_2: Character1;
  character_3: Character1;
  alternative_characters: Character1[];
  bangboos: string[];
  alternative_bangboos: string[];
}

export interface Character1 {
  name: string;
  isFlex: boolean;
  role: Role;
  note: string;
}

export enum Role {
  Anomaly = "Anomaly",
  AnomalyReplacement = "Anomaly Replacement",
  AnyAnomalyUnit = "Any Anomaly Unit",
  AnySupport = "Any Support",
  Attack = "Attack",
  Control = "Control",
  Defense = "Defense",
  DefenseShred = "Defense Shred",
  Dps = "DPS",
  Flex = "Flex",
  Stun = "Stun",
  StunReplacement = "Stun Replacement",
  Support = "Support",
  SupportReplacement = "Support Replacement",
}

export interface WEngines {
  bestWEngines: string[];
  notes: string;
}
