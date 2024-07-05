export interface WEngines {
    name:        string;
    rarity:      Rarity;
    type:        Type;
    bonus:       string;
    description: string;
    base_atk:    number;
    stat_name:   string;
    stat_value:  number;
    id:          string;
}

export enum Rarity {
    A = "A",
    B = "B",
    S = "S",
}

export enum Type {
    Anomaly = "Anomaly",
    Attack = "Attack",
    Defense = "Defense",
    Stun = "Stun",
    Support = "Support",
}
