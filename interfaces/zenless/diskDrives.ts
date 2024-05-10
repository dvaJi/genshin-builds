export interface DiskDrives {
    id:     string;
    name:   string;
    rarity: Rarity;
    bonus:  Bonus[];
}

export interface Bonus {
    count: number;
    value: string;
}

export enum Rarity {
    A = "A",
    B = "B",
    S = "S",
}
