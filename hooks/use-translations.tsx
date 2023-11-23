import { cache } from "react";

import { getDefaultLocale } from "@lib/localData";
import { localeToHSRLang, localeToLang } from "@utils/locale-to-lang";
import { templateReplacement } from "@utils/template-replacement";
import { languages as tofLanguages } from "hsr-data";
import { localesAvailables } from "i18n-config";

export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}
export type IntlMessage = Record<string, string>;

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

const getLanguage = cache((locale: string, game: string) => {
  if (game === "hsr") {
    return localesAvailables.hsr.includes(locale) ? locale : "en";
  }

  if (game === "tof") {
    return localesAvailables.tof.includes(locale) ? locale : "en";
  }

  if (game === "genshin") {
    return localesAvailables.genshin.includes(locale) ? locale : "en";
  }

  return locale || "en";
});

const getLangData = cache((locale: string, game: string) => {
  if (game === "hsr") {
    return localeToHSRLang(locale || "en");
  }

  if (game === "tof") {
    return getDefaultLocale<string>(
      locale,
      tofLanguages as unknown as string[]
    );
  }

  if (game === "genshin") {
    return localeToLang(locale || "en");
  }

  return locale || "en";
});

async function getTranslations(
  locale: string,
  game: string,
  namespace: string
) {
  const language = getLanguage(locale, game);
  const langData = getLangData(locale, game);
  const config = await getConfig(language, game);

  const message = resolvePath(config.messages, namespace, language);
  const common = config.common;

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
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  return {
    t: formatFn,
    messages: config.messages,
    locale,
    language,
    langData,
    common,
    dict: message,
  };
}

// Make sure `now` is consistent across the request in case none was configured
const getDefaultNow = cache(() => new Date());

// This is automatically inherited by `NextIntlClientProvider` if
// the component is rendered from a Server Component
const getDefaultTimeZone = cache(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone
);

const receiveRuntimeConfig = cache(
  async (locale: string, game: string, getConfig: typeof requestConfig) => {
    let result = getConfig?.({ locale, game });
    if (result instanceof Promise) {
      result = await result;
    }
    return {
      ...result,
      // now: result?.now || getDefaultNow(),
      // timeZone: result?.timeZone || getDefaultTimeZone(),
      now: getDefaultNow(),
      timeZone: getDefaultTimeZone(),
    };
  }
);

async function requestConfig({
  locale,
  game,
}: {
  locale: string;
  game: string;
}) {
  return {
    messages: (await import(`../locales/${game}/${locale}.json`)).default,
    common: (await import(`../_content/${game}/data/common.json`))[locale],
  } as any;
}

const getConfig = cache(async (locale: string, game: string) => {
  const runtimeConfig = await receiveRuntimeConfig(locale, game, requestConfig);
  return { ...runtimeConfig, locale };
});

export default cache(getTranslations);
