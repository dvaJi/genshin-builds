export interface Weapons {
    rarity:             number;
    name:               string;
    id:                 string;
    version:            string;
    assets:             Assets;
    element:            string;
    category:           Category;
    charge:             Charge;
    shatter:            Charge;
    banners:            Banner[];
    simulacrumId:       null | string;
    description:        string;
    weaponEffects:      Effect[];
    elementEffect:      Effect;
    upgradeMats:        UpgradeMats;
    weaponAdvancements: WeaponAdvancement[];
    weaponAttacks:      WeaponAttacks;
    weaponStats:        WeaponStat[];
    meta:               Meta;
    fashion:            Fashion[];
    simulacra:          Matrix | null;
    matrix:             Matrix | null;
}

export interface Assets {
    icon:                string;
    weaponIconForMatrix: string;
}

export interface Banner {
    bannerNumber:  number;
    isFinalBanner: boolean;
    endDate:       Date;
    startDate:     Date;
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
    C = "C",
    S = "S",
    Ss = "SS",
}

export interface Effect {
    description: string;
    title:       string;
}

export interface Fashion {
    icon: string;
}

export interface Matrix {
    id:   string;
    name: string;
}

export interface Meta {
    analyticVideoId:     null | string;
    rating:              number[];
    recommendedMatrices: RecommendedMatrix[];
    recommendedPairings: string[];
    lastUpdated:         LastUpdated;
}

export interface LastUpdated {
    username:  Username;
    timestamp: Date;
}

export enum Username {
    Emi = "Emi",
    Unknown = "unknown",
    Zakum = "Zakum",
}

export interface RecommendedMatrix {
    id:     string;
    pieces: number;
}

export interface UpgradeMats {
    levels: Level[];
}

export interface Level {
    requiredExp: number;
    mats:        Mat[];
}

export interface Mat {
    matId:  MatID | null;
    amount: number | null;
    icon:   null | string;
    name:   MatName | null;
    rarity: number | null;
}

export enum MatID {
    ItemBreakthroughA1 = "item_breakthrough_a1",
    ItemBreakthroughA2 = "item_breakthrough_a2",
    ItemBreakthroughA3 = "item_breakthrough_a3",
    ItemBreakthroughB1 = "item_breakthrough_b1",
    ItemBreakthroughB2 = "item_breakthrough_b2",
    ItemBreakthroughB3 = "item_breakthrough_b3",
    ItemBreakthroughC1 = "item_breakthrough_c1",
    ItemBreakthroughC2 = "item_breakthrough_c2",
    ItemBreakthroughC3 = "item_breakthrough_c3",
    ItemBreakthroughD1 = "item_breakthrough_d1",
    ItemBreakthroughD2 = "item_breakthrough_d2",
    ItemBreakthroughD3 = "item_breakthrough_d3",
    ItemGold = "item_gold",
    ItemMineFire = "item_mine_fire",
    ItemMineFire02 = "item_mine_fire_02",
    ItemMineFire03 = "item_mine_fire_03",
    ItemMineIce = "item_mine_ice",
    ItemMineIce02 = "item_mine_ice_02",
    ItemMineIce03 = "item_mine_ice_03",
    ItemMinePhysic = "item_mine_physic",
    ItemMinePhysic02 = "item_mine_physic_02",
    ItemMinePhysic03 = "item_mine_physic_03",
    ItemMineThunder = "item_mine_thunder",
    ItemMineThunder02 = "item_mine_thunder_02",
    ItemMineThunder03 = "item_mine_thunder_03",
}

export enum MatName {
    AcidproofGlazeI = "Acidproof Glaze I",
    AcidproofGlazeII = "Acidproof Glaze II",
    AcidproofGlazeIII = "Acidproof Glaze III",
    BoosterFrameI = "Booster Frame I",
    BoosterFrameII = "Booster Frame II",
    BoosterFrameIII = "Booster Frame III",
    Firecore = "Firecore",
    Gold = "Gold",
    HeartOfLava = "Heart of Lava",
    HeartOfLightning = "Heart of Lightning",
    HeartOfSummit = "Heart of Summit",
    HeartOfWinter = "Heart of Winter",
    Icecore = "Icecore",
    Landsource = "Landsource",
    Lightningsource = "Lightningsource",
    Magcore = "Magcore",
    NanoCoatingI = "Nano Coating I",
    NanoCoatingII = "Nano Coating II",
    NanoCoatingIII = "Nano Coating III",
    NanofiberFrameI = "Nanofiber Frame I",
    NanofiberFrameII = "Nanofiber Frame II",
    NanofiberFrameIII = "Nanofiber Frame III",
    Rockcore = "Rockcore",
    Snowsource = "Snowsource",
    Sunsource = "Sunsource",
}

export interface WeaponAdvancement {
    charge:      Charge;
    shatter:     Charge;
    description: string;
    need:        string;
    multiplier:  Multiplier[];
}

export interface Multiplier {
    coefficient: number;
    statId:      ID;
}

export enum ID {
    CommonAtkAdded = "CommonAtkAdded",
    CritAdded = "CritAdded",
    ElementDef = "ElementDef",
    MaxHealthAdded = "MaxHealthAdded",
}

export interface WeaponAttacks {
    normals:   Discharge[];
    skill:     Discharge[];
    dodge:     Discharge[];
    discharge: Discharge[];
}

export interface Discharge {
    description: string;
    icon:        string;
    name:        string;
    operations:  Operation[];
    tags:        Tag[];
    values:      Array<number[]>;
}

export enum Operation {
    Attack = "Attack",
    Crouch = "Crouch",
    Dash = "Dash",
    HoldAttack = "Hold Attack",
    Jump = "Jump",
    Movement = "Movement",
}

export enum Tag {
    Ammo = "Ammo",
    Control = "Control",
    Damage = "Damage",
    Debuff = "Debuff",
    Hyperbody = "Hyperbody",
    Support = "Support",
}

export interface WeaponStat {
    id:          ID;
    name:        WeaponStatName;
    icon:        string;
    value:       number;
    upgradeProp: number;
}

export enum WeaponStatName {
    Attack = "Attack",
    Crit = "Crit",
    HP = "HP",
    Resistance = "Resistance",
}
