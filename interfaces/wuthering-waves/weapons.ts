export interface Weapons {
    name:        string;
    image:       string;
    rarity:      number;
    type:        Type;
    skill:       string;
    description: string;
    atk:         string;
    stat_name:   StatName;
    stat_value:  string;
    id:          string;
}

export enum StatName {
    Atk = "ATK",
    CritDMG = "Crit DMG",
    CritRate = "Crit Rate",
    Def = "DEF",
    EnergyRegen = "Energy Regen",
    HP = "HP",
}

export enum Type {
    Broadblade = "Broadblade",
    Gauntlets = "Gauntlets",
    Pistols = "Pistols",
    Rectifier = "Rectifier",
    Sword = "Sword",
}
