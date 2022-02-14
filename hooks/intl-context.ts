import { createContext } from "react";

export type IntlMessage = Record<string, string>;

export type IntlContextShape = {
  messages?: IntlMessage;
  locale: string;
};

export const IntlContext = createContext<IntlContextShape | undefined>(
  undefined
);
