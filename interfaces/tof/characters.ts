export interface Characters {
  name:     string;
  rarity:   number;
  id:       string;
  weaponId: string;
  matrixId: string;
  version:  string;
  banners:  Banner[];
  assetsA0: AssetsA0;
  weapon:   Weapon;
}

export interface AssetsA0 {
  painting:     string;
  avatar:       string;
  titlePicture: string;
}

export interface Banner {
  bannerNumber:  number;
  isFinalBanner: boolean;
  endDate:       Date;
  startDate:     Date;
}

export interface Weapon {
  rarity:   number;
  element:  string;
  category: Category;
  charge:   Charge;
  shatter:  Charge;
}

export enum Category {
  Dps = "DPS",
  Sup = "SUP",
  Tank = "Tank",
}

export interface Charge {
  tier:  Tier;
  value: number;
}

export enum Tier {
  A = "A",
  B = "B",
  S = "S",
  Ss = "SS",
}
