export interface Bangboos {
    name:   string;
    rarity: Rarity;
    skills: Skill[];
    id:     string;
    sm?:    Sm;
}

export enum Rarity {
    A = "A",
    S = "S",
}

export interface Skill {
    name:        string;
    type:        Type;
    use:         Use;
    description: string;
}

export enum Type {
    A = "a",
    B = "b",
    C = "c",
}

export enum Use {
    Active = "Active",
    ChainAttack = "Chain Attack",
    Passive = "Passive",
}

export enum Sm {
    True = "TRUE",
}
