export interface WEngines {
    id:          string;
    name:        string;
    rarity:      Rarity;
    bonus:       string;
    description: string;
    base_atk:    number;
    stat_name:   string;
    stat_value:  number;
}

export enum Rarity {
    A = "A",
    B = "B",
    S = "S",
}
