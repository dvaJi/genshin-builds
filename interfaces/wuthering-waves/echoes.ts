export interface Echoes {
    name:     string;
    image:    string;
    cost:     number;
    elements: Element[];
    skill:    string;
    id:       string;
}

export enum Element {
    CelestialLight = "Celestial Light",
    FreezingFrost = "Freezing Frost",
    LingeringTunes = "Lingering Tunes",
    MoltenRift = "Molten Rift",
    MoonlitClouds = "Moonlit Clouds",
    RejuvenatingGlow = "Rejuvenating Glow",
    SierraGale = "Sierra Gale",
    SunSinkingEclipse = "Sun-sinking Eclipse",
    VoidThunder = "Void Thunder",
}
