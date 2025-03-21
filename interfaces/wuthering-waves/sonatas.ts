export interface Sonatas {
  _id: number;
  id: string;
  name: string;
  icon: string;
  color: string;
  set: Set[];
}

export interface Set {
  id: number;
  desc: string;
  param: string[];
  key: number;
}
