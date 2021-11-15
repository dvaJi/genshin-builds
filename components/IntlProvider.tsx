import { IntlContext } from "@hooks/intl-context";
import { useRouter } from "next/router";

type IntlProviderProps = {
  messages?: Record<string, string>;
  children: React.ReactNode;
};

export default function IntlProvider({
  children,
  ...contextValues
}: IntlProviderProps) {
  const nextLocale = useRouter().locale;
  let locale = "en";
  if (nextLocale) locale = nextLocale;

  return (
    <IntlContext.Provider value={{ ...contextValues, locale }}>
      {children}
    </IntlContext.Provider>
  );
}
