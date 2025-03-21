export interface Relic {
  _id: number;
  id: string;
  name: string;
  desc: string;
  isPlanarOrnament: boolean;
  effects: { [key: string]: string };
  pieces: Piece[];
}

export interface Piece {
  _id: number;
  ids: number[];
  id: string;
  name: string;
  type: Type;
  desc: string;
  typeText: string;
  backstory: string;
}

export enum Type {
  Body = "BODY",
  Foot = "FOOT",
  Hand = "HAND",
  Head = "HEAD",
  Neck = "NECK",
  Object = "OBJECT",
}
