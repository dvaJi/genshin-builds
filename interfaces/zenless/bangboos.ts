export interface Bangboos {
    _id:    number;
    id:     string;
    name:   string;
    rarity: number;
    icon?:  string;
    skills: { [key: string]: Skill };
}

export interface Skill {
    name:        string;
    description: string;
    type:        number;
    props:       string[];
    level:       Level[];
}

export interface Level {
    level: number;
    param: string;
}
