export interface BuildsAndTeams {
  id:     string;
  builds: Builds;
  teams:  Teams;
}

export interface Builds {
  character:             string;
  skillPriorityAndForte: SkillPriorityAndForte;
  bestMainEchoes:        BestMainEcho[];
  bestEchoSets:          BestEchoSet[];
  mainEcho:              string;
  bestWeapons:           string[];
  bestEchoStats:         BestEchoStats;
  builds:                Build[];
  tipsAndTricks:         string[];
}

export interface BestEchoSet {
  setsName:            string[];
  rating:              number;
  pieces:              number;
  recommendedMainEcho: null | string;
  explanation:         string;
}

export interface BestEchoStats {
  mainStats:        MainStats;
  substatsPriority: string[];
}

export interface MainStats {
  cost4: string[];
  cost3: string[];
  cost1: Cost1[];
}

export enum Cost1 {
  ATKOrEnergyRegen = "ATK% or Energy Regen",
  Atk = "ATK%",
  Def = "DEF%",
  HP = "HP%",
}

export interface BestMainEcho {
  name:        string;
  explanation: string;
}

export interface Build {
  name:               string;
  bestWeapon:         string;
  alternativeWeapons: string[];
  notes:              string;
}

export interface SkillPriorityAndForte {
  skillPriority: SkillPriority[];
  forte:         Forte[];
}

export interface Forte {
  name:         string;
  effect:       string;
  requirements: string;
}

export interface SkillPriority {
  name:        Name;
  priority:    number;
  explanation: string;
}

export enum Name {
  BasicAttack = "Basic Attack",
  EnergyRegenOrHP = "Energy Regen or HP%",
  ForteCircuit = "Forte Circuit",
  HP = "HP%",
  HealingBonusOrCRITDMG = "Healing Bonus or CRIT DMG",
  IntroSkill = "Intro Skill",
  NormalAttack = "Normal Attack",
  ResonanceLiberation = "Resonance Liberation",
  ResonanceSkill = "Resonance Skill",
}

export interface Teams {
  character: string;
  teams:     Team[];
}

export interface Team {
  name:                       string;
  composition:                Composition[];
  otherRecommendedCharacters: OtherRecommendedCharacter[];
  strategy:                   string[];
  notes:                      string;
}

export interface Composition {
  role:      Role;
  character: string;
  isFlex:    boolean;
}

export enum Role {
  DPSReplacement = "DPS Replacement",
  GroupingSupport = "Grouping Support",
  MainDPS = "Main DPS",
  MainDPSReplacement = "Main DPS Replacement",
  SingleTargetDPS = "Single-Target DPS",
  SubDPS = "Sub-DPS",
  SubDPSReplacement = "Sub-DPS Replacement",
  Support = "Support",
  SupportReplacement = "Support Replacement",
}

export interface OtherRecommendedCharacter {
  role:        Role;
  character:   string;
  explanation: string;
}
