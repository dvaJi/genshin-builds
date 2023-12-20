export interface Character {
  _id: number;
  id: string;
  name: string;
  description: string;
  rarity: number;
  combat_type: CombatType;
  path: CombatType;
  faction: Faction;
  cv: Cv;
  ascends: Ascend[];
  skills: Skill[];
  eidolons: Faction[];
  skillTreePoints: SkillTreePoint[];
}

export interface Ascend {
  promotion: number;
  maxLevel: number;
  materials: Faction[];
  attackBase: number;
  attackAdd: number;
  hpBase: number;
  hpAdd: number;
  defenseBase: number;
  defenseAdd: number;
  crate: number;
  cdmg: number;
  aggro: number;
  speedBase: number;
  speedAdd: number;
}

export interface Faction {
  _id?: number;
  id: string;
  name: string;
  amount?: number;
  desc?: string;
}

export interface CombatType {
  id: string;
  name: string;
}

export interface Cv {
  english: string;
  chinese: string;
  japanese: string;
  korean: string;
}

export interface SkillTreePoint {
  id: number;
  type: number;
  children: SkillTreePoint[];
  embedBonusSkill?: EmbedBonusSkill;
  embedBuff?: EmbedBuff;
}

export interface EmbedBonusSkill {
  id: string;
  name: string;
  desc: string;
  type: string;
  tag: string;
  levels: Level[];
}

export interface Level {
  level: number;
  params: number[];
  materials?: Faction[];
}

export interface EmbedBuff {
  id: string;
  name: string;
  levelReq: number;
  promotionReq: number;
  statusList: StatusList[];
  materials: Faction[];
}

export interface StatusList {
  key: string;
  value: number;
}

export interface Skill {
  _id: number;
  id: string;
  name: string;
  desc: string;
  simpleDesc: string;
  type: string;
  tag: string;
  levels: Level[];
}
