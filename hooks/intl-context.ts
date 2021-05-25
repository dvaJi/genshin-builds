import { createContext } from "react";

export type IntlContextShape = {
  messages?: Record<string, string>;
  locale: string;
};

export const IntlContext =
  createContext<IntlContextShape | undefined>(undefined);
