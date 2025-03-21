export interface Characters {
  _id: number;
  id: string;
  codename: string;
  nameEn: string;
  name: string;
  fullname: string;
  house: string;
  houseIcon: string;
  type: string;
  typeIcon: string;
  element: string[];
  elementIcon: string[];
  gender: string;
  icon: string;
  rarity: number;
  partnerInfo: PartnerInfo;
  drive: string[];
  engine: string[];
  main_stats: string[];
  sub_stats: string[];
  team: string;
  hp: number;
  def: number;
  atk: number;
  crit_rate: number;
  crit_dmg: number;
  pen_ratio: number;
  impact: number;
  anomaly_mastery: number;
  anomaly_proficiency: number;
  energy_regen: number;
  skills: Skill[];
  talents: Skill[];
}

export interface PartnerInfo {
  birthday?: string;
  fullName?: string;
  gender?: string;
  iconPath?: string;
  impressionF?: string;
  impressionM?: string;
  outlook?: string;
  profileDesc?: string;
  race?: string;
  roleIcon?: string;
  stature?: string;
  unlockCondition?: string[];
}

export interface Skill {
  name: string;
  group: Group;
  title?: string;
  description: string;
}

export enum Group {
  Basic = "Basic",
  Chain = "Chain",
  Core = "Core",
  Dodge = "Dodge",
  Special = "Special",
  Talent = "Talent",
}
