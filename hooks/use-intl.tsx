import useIntlContext from "./use-intl-context";
import { templateReplacement } from "@utils/template-replacement";
import { localeToLang } from "@utils/locale-to-lang";
import { IntlMessage } from "./intl-context";

export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}

export interface useIntlResponse {
  t: (props: IntlFormatProps) => string;
  tfn: (props: IntlFormatProps) => string;
  locale: string;
  localeGI: string;
}

const resolvePath = (dict: IntlMessage, namespace = "", locale: any) => {
  let message: unknown = dict;

  namespace.split(".").forEach((part) => {
    const next = (message as any)[part];

    if (part == null || next == null) {
      const errorMsg = `Could not resolve \`${namespace}\` in messages. ${locale}`;
      if (process.env.NODE_ENV === "development") {
        // throw new Error(errorMsg);
      } else {
        console.error(errorMsg);
      }
    }

    message = next;
  });

  return message as any;
};

const useIntl = (namespace?: string): useIntlResponse => {
  const { messages: dict = {}, locale } = useIntlContext();

  const message = resolvePath(dict, namespace, locale);

  const formatFn = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (message && message[id]) {
      return values ? templateReplacement(message[id], values) : message[id];
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[useIntl] Missing translation for "${id}" in "${
          localeToLang(locale) || locale
        }" locale, ${namespace}.`
      );
    }

    return values
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  return { t: formatFn, tfn: formatFn, locale, localeGI: localeToLang(locale) };
};

export default useIntl;
