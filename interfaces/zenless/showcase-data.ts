export interface ShowcaseData {
  id: string;
  loc: { [key: string]: string };
  weapons: { [key: string]: Weapon };
  titles: { [key: string]: Title };
  property: { [key: string]: Property };
  pfps: { [key: string]: Namecard };
  namecards: { [key: string]: Namecard };
  medals: { [key: string]: Medal };
  equipments: Equipments;
  avatars: { [key: string]: Avatar };
}

export interface Avatar {
  Name: string;
  Rarity: number;
  ProfessionType: ProfessionType;
  ElementTypes: string[];
  Image: string;
  CircleIcon: string;
  WeaponId: number;
  Skins: { [key: string]: Skin };
  Colors: Colors;
  HighlightProps: number[];
  BaseProps: { [key: string]: number };
  GrowthProps: { [key: string]: number };
  PromotionProps: { [key: string]: number }[];
  CoreEnhancementProps: { [key: string]: number }[];
}

export interface Colors {
  Accent: string;
  Mindscape: string;
}

export enum ProfessionType {
  Anomaly = "Anomaly",
  Attack = "Attack",
  Defense = "Defense",
  Stun = "Stun",
  Support = "Support",
}

export interface Skin {
  Image: string;
  CircleIcon: string;
}

export interface Equipments {
  Items: { [key: string]: Item };
  Suits: { [key: string]: Suit };
}

export interface Item {
  Rarity: number;
  SuitId: number;
}

export interface Suit {
  Icon: string;
  Name: string;
  SetBonusProps: { [key: string]: number };
}

export interface Medal {
  Name: string;
  Icon: string;
  TipNum: TipNum;
}

export enum TipNum {
  MedalTipsNum1 = "MedalTipsNum1",
  MedalTipsNum2 = "MedalTipsNum2",
}

export interface Namecard {
  Icon: string;
}

export interface Property {
  Name: string;
  Format: Format;
}

export enum Format {
  Empty = "",
  Fluffy00 = "{0:0.##}",
  Format00 = "{0:0.#%}",
  Purple00 = "{0:0.#}",
  The00 = "{0:0}",
}

export interface Title {
  TitleText: string;
  ColorA: ColorA;
  ColorB: ColorB;
}

export enum ColorA {
  E6E9Ea = "e6e9ea",
  F58661 = "f58661",
  Fab700 = "fab700",
  Ffffff = "FFFFFF",
  The00Cefb = "00cefb",
}

export enum ColorB {
  Empty = "",
  Fe357B = "fe357b",
  Fe6300 = "fe6300",
  The0263E5 = "0263e5",
  The8Ea3AE = "8ea3ae",
}

export interface Weapon {
  ItemName: string;
  Rarity: number;
  ProfessionType: ProfessionType;
  ImagePath: string;
  MainStat: Stat;
  SecondaryStat: Stat;
}

export interface Stat {
  PropertyId: number;
  PropertyValue: number;
}
