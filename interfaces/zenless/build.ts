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
  "main-stats": { [key: string]: string[] };
  "sub-stats": SubStat[];
}

export interface DriveDisc {
  name: string;
  pieces: number;
}

export enum SubStat {
  AnomalyProficiency = "Anomaly Proficiency",
  Atk = "ATK",
  CRITRate = "CRIT Rate",
  CritDmg = "CRIT DMG",
  Def = "DEF",
  Pen = "PEN",
  PercentATK = "Percent ATK",
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
  character_1: Character;
  character_2: Character;
  character_3: Character;
  bangboos: string[];
}

export interface Character {
  name: string;
  role: Role;
}

export enum Role {
  Anomaly = "Anomaly",
  Attack = "Attack",
  Defense = "Defense",
  Stun = "Stun",
  StunSubDPS = "Stun/Sub-DPS",
  Support = "Support",
}

export interface WEngines {
  bestWEngines: string[];
  notes: string;
}
