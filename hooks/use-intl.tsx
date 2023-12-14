import { localeToLang } from "@utils/locale-to-lang";
import { templateReplacement } from "@utils/template-replacement";
import { IntlMessage } from "./intl-context";
import useIntlContext from "./use-intl-context";

export interface IntlFormatProps {
  id: string;
  defaultMessage?: string;
  values?: Record<string, string>;
}

export interface useIntlResponse {
  t: (input: InputType, values?: Record<string, string>) => string;
  tfn: (input: InputType, values?: Record<string, string>) => string;
  locale: string;
  localeGI: string;
}

type InputType = IntlFormatProps | string;

const resolvePath = (dict: IntlMessage, namespace = "", locale: any) => {
  let message: unknown = dict;

  namespace.split(".").forEach((part) => {
    const next = (message as any)[part];

    if (part == null || next == null) {
      const errorMsg = `[useIntl] Could not resolve \`${namespace}\` in messages. ${locale}`;
      console.error(errorMsg);
    }

    message = next;
  });

  return message as any;
};

const useIntl = (namespace?: string): useIntlResponse => {
  const { messages: dict = {}, common, locale } = useIntlContext();

  const message = resolvePath(dict, namespace, locale);

  const format = (input: InputType, values?: Record<string, string>) => {
    if (typeof input === "string") {
      return formatFn({ id: input, values });
    }

    return formatFn(input);
  };

  const formatFn = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (message && message[id]) {
      return values ? templateReplacement(message[id], values) : message[id];
    }

    if (common && common[id]) {
      return values ? templateReplacement(common[id], values) : common[id];
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[useIntl] Missing translation for "${id}" in "${
          localeToLang(locale) || locale
        }" locale, ${namespace}.`
      );
    }

    return values
      ? templateReplacement(defaultMessage ?? id, values)
      : defaultMessage ?? id;
  };

  return { t: format, tfn: format, locale, localeGI: localeToLang(locale) };
};

export default useIntl;
