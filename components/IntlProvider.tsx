'use client';

import { IntlContext } from "@hooks/intl-context";

type IntlProviderProps = {
  common?: Record<string, string>;
  messages?: Record<string, string>;
  locale?: string;
  children: React.ReactNode;
};

export default function IntlProvider({
  children,
  locale = "en",
  ...contextValues
}: IntlProviderProps) {

  return (
    <IntlContext.Provider value={{ ...contextValues, locale }}>
      {children}
    </IntlContext.Provider>
  );
}
