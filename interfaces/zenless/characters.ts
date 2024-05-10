export interface Characters {
    name:               string;
    id:                 string;
    rarity:             Rarity;
    element:            Element[];
    type:               Type[];
    house?:             string;
    hp?:                number;
    def?:               number;
    atk?:               number;
    crit_rate?:         number;
    crit_dmg?:          number;
    pen_ratio?:         number;
    pen?:               number;
    impact?:            number;
    attribute_mastery?: number;
    energy_regen?:      number;
    skills:             Skill[];
    tba?:               boolean;
}

export enum Element {
    Electric = "Electric",
    Ether = "Ether",
    Fire = "Fire",
    Ice = "Ice",
    Physical = "Physical",
}

export enum Rarity {
    A = "A",
    S = "S",
}

export interface Skill {
    name:        string;
    group:       Group;
    title?:      string;
    element?:    Element[];
    type?:       Type[];
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

export enum Type {
    Pierce = "Pierce",
    Slash = "Slash",
    Strike = "Strike",
}
