export interface Bangboos {
    id:     string;
    name:   string;
    rarity: Rarity;
    skills: Skill[];
    hp:     number;
    def:    number;
    atk:    number;
    impact: number;
}

export enum Rarity {
    A = "A",
    B = "B",
    S = "S",
}

export interface Skill {
    name:               string;
    type:               Type;
    cooldown?:          Cooldown;
    description:        string;
    buff_duration?:     string;
    hp_recovery?:       number;
    hp_shield?:         number;
    energy_generation?: string;
}

export enum Cooldown {
    The3TimesMin = "3 times/min",
    The4TimesMin = "4 times/min",
    The5TimesMin = "5 times/min",
}

export enum Type {
    A = "a",
    B = "b",
    C = "c",
}
