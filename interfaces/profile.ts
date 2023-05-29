export interface Profile {
  uuid: string;
  nickname: string;
  profilePictureId: number;
  profileCostumeId: number;
  namecardId: number;
  level: number;
  signature: string;
  worldLevel: number;
  finishAchievementNum: number;
  region: string;
  builds: Build[];
  updatedAt: string;
}

export interface Build {
  _id: string;
  avatarId: number;
  id: string;
  name: string;
  rarity: number;
  level: number;
  ascension: number;
  constellation: number;
  fetterLevel: number;
  stats: { [key: string]: number };
  critValue: number;
  flower?: Flower;
  plume?: Plume;
  sands?: BuildCirclet;
  goblet?: BuildCirclet;
  circlet?: BuildCirclet;
  sets: Set[];
  weapon: Weapon;
}

export interface BuildCirclet {
  artifactId: number;
  id: string;
  name: string;
  rarity: number;
  mainStat: { [key: string]: number };
  subStats: { [key: string]: SubStat };
  subStatsIds: string;
  critValue: number;
}

export interface SubStat {
  value: number;
  count: number;
}

export type ArtifactType = Flower | Plume | BuildCirclet;

export interface Flower {
  artifactId: number;
  id: string;
  name: string;
  rarity: number;
  mainStat: FlowerMainStat;
  subStats: { [key: string]: SubStat };
  subStatsIds: string;
  critValue: number;
}

export interface FlowerMainStat {
  HP: number;
}

export interface Plume {
  artifactId: number;
  id: string;
  name: string;
  rarity: number;
  mainStat: PlumeMainStat;
  subStats: { [key: string]: SubStat };
  subStatsIds: string;
  critValue: number;
}

export interface PlumeMainStat {
  ATK: number;
}

export interface Set {
  _id: number;
  id: string;
  name: string;
  min_rarity: number;
  max_rarity: number;
  two_pc: string;
  four_pc: string;
  goblet: FlowerClass;
  plume: FlowerClass;
  circlet: FlowerClass;
  flower: FlowerClass;
  sands: FlowerClass;
}

export interface FlowerClass {
  _id: number;
  id: string;
  name: string;
  description: string;
}

export interface Weapon {
  weaponId: number;
  id: string;
  name: string;
  rarity: number;
  level: number;
  promoteLevel: number;
  refinement: number;
  stat: { [key: string]: number };
}
