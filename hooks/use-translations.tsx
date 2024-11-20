import { localesAvailables } from "i18n-config";
import { cache } from "react";

import {
  localeToHSRLang,
  localeToLang,
  localeToWWLang,
} from "@utils/locale-to-lang";
import { templateReplacement } from "@utils/template-replacement";

export interface IntlFormatProps {
  id: string;
  defaultMessage?: string;
  values?: Record<string, string>;
}
export type IntlMessage = Record<string, string>;
type InputType = IntlFormatProps | string;

const resolvePath = (dict: IntlMessage, namespace = "", locale: any) => {
  let message: unknown = dict;

  namespace.split(".").forEach((part) => {
    const next = (message as any)[part];

    if (part == null || next == null) {
      const errorMsg = `[getTranslations] Could not resolve \`${namespace}\` in messages. ${locale}`;
      console.error(errorMsg);
    }

    message = next;
  });

  return message as any;
};

const getLanguage = (locale: string, game: string) => {
  if (game === "hsr") {
    return localesAvailables.hsr.includes(locale) ? locale : "en";
  }

  if (game === "genshin") {
    return localesAvailables.genshin.includes(locale) ? locale : "en";
  }

  if (game === "wuthering-waves") {
    return localesAvailables["wuthering-waves"].includes(locale)
      ? locale
      : "en";
  }

  if (game === "zenless") {
    return localesAvailables.zenless.includes(locale) ? locale : "en";
  }

  return locale || "en";
};

const getLangData = (locale: string, game: string) => {
  if (game === "hsr" || game === "zenless") {
    return localeToHSRLang(locale || "en");
  }

  if (game === "wuthering-waves") {
    return localeToWWLang(locale || "en");
  }

  if (game === "genshin") {
    return localeToLang(locale || "en");
  }

  return locale || "en";
};

async function getTranslations(
  locale: string,
  game: string,
  namespace: string
) {
  const language = getLanguage(locale, game);
  const langData = getLangData(locale, game);
  const allMessages = await getMessages(language, game);

  const message = resolvePath(allMessages.messages, namespace, language);
  const common = allMessages.common;

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
        `[useIntl] Missing translation for "${id}" in "${language}" language, ${namespace}.`
      );
    }

    return values
      ? templateReplacement(defaultMessage ?? id, values)
      : (defaultMessage ?? id);
  };

  return {
    t: format,
    messages: allMessages.messages,
    locale,
    language,
    langData,
    common,
    dict: message,
  };
}

const getMessages = cache(async (locale: string, game: string) => {
  return {
    messages: (await import(`../locales/${game}/${locale}.json`)).default,
    common:
      (await import(`../_content/${game}/data/common.json`))[locale] || {},
  };
});

export default cache(getTranslations);
