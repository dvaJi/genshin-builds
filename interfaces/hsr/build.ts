export interface Build {
  builds: Recommended[];
  teams: Team[];
  lightcones: string[];
  relics: Relics;
  talents_priority: TalentsPriority[];
}

export interface Recommended {
  name: string;
  data: BuildData;
}

export interface BuildData {
  bestLightCone: string;
  relics: string[];
  mainStat: MainStat;
  subStat: SubStat[];
}

export interface MainStat {
  body: string[];
  feet: Foot[];
  sphere: string[];
  link: Link[];
}

export type Foot = "ATK%" | "SPD" | "DEF%";

export type Link = "ATK%" | "Energy Regen";

export interface SubStat {
  value: string;
  stars: number;
}

export interface Relics {
  set: Set[];
  ornament: string[];
}

export interface Set {
  ids: string[];
  amount: number;
}

export interface TalentsPriority {
  talent: Talent;
  priority: number;
}

export type Talent = "basic_attack" | "skill" | "ultimate" | "talent";

export interface Team {
  name: string;
  data: TeamData;
}

export interface TeamData {
  characters: BuildCharacter[];
  alternatives: string[];
}

export interface BuildCharacter {
  id: string;
  role: string;
  isFlex: boolean;
}
