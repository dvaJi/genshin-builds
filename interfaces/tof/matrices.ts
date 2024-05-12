export interface Matrices {
    id:      string;
    rarity:  number;
    name:    string;
    version: string;
    assets:  Assets;
    banners: Banner[];
}

export interface Assets {
    iconLarge: string;
}

export interface Banner {
    bannerNumber:  number;
    isFinalBanner: boolean;
    endDate:       Date;
    startDate:     Date;
}
