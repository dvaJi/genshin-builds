export interface Items {
    id:          string;
    name:        string;
    icon:        string;
    description: string;
    type:        Type;
    rarity:      number;
    giftTags:    GiftTag[];
}

export interface GiftTag {
    tagId: TagID;
    name:  Name;
}

export enum Name {
    Aesperia = "Aesperia",
    Collectible = "Collectible",
    Decorations = "Decorations",
    Domain9 = "Domain 9",
    EverydayItems = "Everyday Items",
    Figurines = "Figurines",
    Games = "Games",
    LimitedStoreItems = "Limited Store Items",
    MetalItems = "Metal Items",
    RareItems = "Rare items",
    Toys = "Toys",
    Vera = "Vera",
}

export enum TagID {
    Asshai = "Asshai",
    Collection = "collection",
    Decorate = "decorate",
    EverydayObjects = "everydayObjects",
    Game = "game",
    GarageKit = "garageKit",
    Jiuyu = "Jiuyu",
    Metal = "metal",
    Rarity = "rarity",
    RestrictedGoods = "restrictedGoods",
    Toy = "toy",
    Vera = "Vera",
}

export enum Type {
    Airjar = "AIRJAR",
    Artifact = "ARTIFACT",
    Avatar = "AVATAR",
    Barter = "BARTER",
    Book = "BOOK",
    Card = "CARD",
    Certificate = "CERTIFICATE",
    Chest = "CHEST",
    Choose = "CHOOSE",
    Coin = "COIN",
    Consumable = "CONSUMABLE",
    Cooking = "COOKING",
    Costvoucher = "COSTVOUCHER",
    Count = "COUNT",
    Diy = "DIY",
    Equip = "EQUIP",
    Equipment = "EQUIPMENT",
    Exp = "EXP",
    Firework = "FIREWORK",
    Food = "FOOD",
    Fragment = "FRAGMENT",
    Frame = "FRAME",
    Gift = "GIFT",
    Giftpack = "GIFTPACK",
    Info = "INFO",
    ItemTypeCurrency = "ITEM_TYPE_CURRENCY",
    Map = "MAP",
    Material = "MATERIAL",
    Matrix = "MATRIX",
    Mount = "MOUNT",
    Order = "ORDER",
    Pickuse = "PICKUSE",
    Pilot = "PILOT",
    Point = "POINT",
    Property = "PROPERTY",
    Quest = "QUEST",
    Radar = "RADAR",
    Rename = "RENAME",
    Rmbticket = "RMBTICKET",
    Rolesex = "ROLESEX",
    Rune = "RUNE",
    Skin = "SKIN",
    Stamina = "STAMINA",
    System = "SYSTEM",
    Times = "TIMES",
    Weapon = "WEAPON",
}
