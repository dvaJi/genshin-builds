export interface Characters {
  name: string;
  rarity: number;
  id: string;
  weaponId: string;
  matrixId: string;
  version: string;
  banners: Banner[];
  assetsA0: AssetsA0;
  weapon: Weapon;
  matrix: Matrix;
  advanceId: null | string;
  affiliation: string;
  avatarId: string;
  awakening: Awakening[];
  birthday: string;
  gender: Gender;
  guidebook: Guidebook[];
  height: string;
  homeTown: string;
  likedGiftTypes: string[];
  dislikedGiftTypes: DislikedGiftType[];
  voicing: Voicing;
}

export interface AssetsA0 {
  painting: string;
  avatar: string;
  titlePicture: string;
  descPainting: string;
}

export interface Awakening {
  description: null | string;
  icon: null | string;
  name: null | string;
  need: number;
}

export interface Banner {
  bannerNumber: number;
  isFinalBanner: boolean;
  endDate: Date;
  startDate: Date;
}

export enum DislikedGiftType {
  Asshai = "Asshai",
  Jiuyu = "Jiuyu",
  Vera = "Vera",
}

export enum Gender {
  Female = "Female",
  Male = "Male",
}

export interface Guidebook {
  description: string;
  icon: string;
  title: string;
}

export interface Matrix {
  name: string;
}

export interface Voicing {
  cn: string;
  en: string;
  jp: string;
  kr: string;
  pt: string;
}

export interface Weapon {
  name: string;
  rarity: number;
  element: string;
  category: Category;
  charge: Charge;
  shatter: Charge;
}

export enum Category {
  Dps = "DPS",
  Sup = "SUP",
  Tank = "Tank",
}

export interface Charge {
  tier: Tier;
  value: number;
}

export enum Tier {
  A = "A",
  B = "B",
  S = "S",
  Ss = "SS",
}
