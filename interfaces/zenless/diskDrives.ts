export interface DiskDrives {
    name:   string;
    rarity: Rarity;
    bonus:  Bonus[];
    id:     string;
}

export interface Bonus {
    count: number;
    value: string;
}

export enum Rarity {
    S = "S",
}
