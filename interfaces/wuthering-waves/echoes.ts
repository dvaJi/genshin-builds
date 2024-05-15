export interface Echoes {
    name:     string;
    image:    string;
    class:    Class;
    cost:     number;
    elements: Element[];
    skill:    string;
    id:       string;
}

export enum Class {
    Calamity = "Calamity",
    Common = "Common",
    Elite = "Elite",
    Overlord = "Overlord",
}

export enum Element {
    CelestialLight = "Celestial Light",
    EndlessResonance = "Endless Resonance",
    FreezingFrost = "Freezing Frost",
    HavocEclipse = "Havoc Eclipse",
    MoltenRift = "Molten Rift",
    MoonlitClouds = "Moonlit Clouds",
    RejuvenatingGlow = "Rejuvenating Glow",
    SierraGale = "Sierra Gale",
    VoidThunder = "Void Thunder",
}
