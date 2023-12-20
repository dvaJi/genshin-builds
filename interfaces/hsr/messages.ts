export interface Messages {
    id:              number;
    contacts:        Contacts;
    relatedMessages: number[];
    sections:        Section[];
}

export interface Contacts {
    id:        number;
    name:      string;
    icon:      string;
    signature: null | string;
    typeId?:   number;
    type:      ContactsType;
}

export enum ContactsType {
    Andere = "Andere",
    Autres = "Autres",
    BatePapoEmGrupo = "Bate-papo em Grupo",
    Characters = "Characters",
    Figuren = "Figuren",
    GroupChats = "Group Chats",
    GroupesDeDiscussion = "Groupes de discussion",
    GrupChat = "Grup Chat",
    Grupos = "Grupos",
    Gruppenchat = "Gruppenchat",
    Karakter = "Karakter",
    Khác = "Khác",
    Lainnya = "Lainnya",
    NhânVật = "Nhân Vật",
    None = "None",
    Others = "Others",
    Otros = "Otros",
    Outros = "Outros",
    Personagens = "Personagens",
    Personajes = "Personajes",
    Personnages = "Personnages",
    TròChuyệnNhóm = "Trò Chuyện Nhóm",
    ГрупповойЧат = "Групповой чат",
    Другое = "Другое",
    Персонаж = "Персонаж",
    กลุ่มแชท = "กลุ่มแชท",
    ตัวละคร = "ตัวละคร",
    อื่นๆ = "อื่นๆ",
    その他 = "その他",
    キャラクター = "キャラクター",
    グループチャット = "グループチャット",
    其他 = "其他",
    群組聊天 = "群組聊天",
    群聊 = "群聊",
    角色 = "角色",
    기타 = "기타",
    단톡방 = "단톡방",
    캐릭터 = "캐릭터",
}

export interface Section {
    id:                       number;
    startingMessageId:        number[];
    messages:                 { [key: string]: Message };
    participatingContactsIds: number[];
}

export interface Message {
    id:              number;
    type:            MessageType;
    sender:          Sender;
    senderContactId: number;
    text?:           string;
    next:            number[];
    image?:          string;
}

export enum Sender {
    Npc = "NPC",
    Player = "Player",
    PlayerAuto = "PlayerAuto",
    System = "System",
}

export enum MessageType {
    Image = "Image",
    Link = "Link",
    RAID = "Raid",
    Sticker = "Sticker",
    Text = "Text",
}
