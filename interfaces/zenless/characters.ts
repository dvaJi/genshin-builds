export interface Characters {
    name:                string;
    id:                  string;
    drive:               string[];
    engine:              string[];
    main_stats:          string[];
    sub_stats:           string[];
    team:                string;
    rarity:              Rarity;
    element:             string[];
    type:                string;
    house:               string;
    hp:                  number;
    def:                 number;
    atk:                 number;
    crit_rate:           number;
    crit_dmg:            number;
    pen_ratio:           number;
    impact:              number;
    anomaly_mastery:     number;
    anomaly_proficiency: number;
    energy_regen:        number;
    skills:              Skill[];
}

export enum Rarity {
    A = "A",
    S = "S",
}

export interface Skill {
    name:        string;
    group:       Group;
    title?:      string;
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
