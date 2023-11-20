import { cache } from "react";

import { templateReplacement } from "@utils/template-replacement";
import { cookies } from "next/headers";

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

const getLocale = cache(() => {
  const cookieStore = cookies();
  const lang = cookieStore.get("x-gb-lang");
  return lang?.value || "en";
});

async function getTranslations(game: string, namespace: string) {
  const locale = getLocale();
  const config = await getConfig(locale, game);

  const message = resolvePath(config.messages, namespace, locale);
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
        `[useIntl] Missing translation for "${id}" in "${locale}" locale, ${namespace}.`
      );
    }

    return values
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  // return createTranslator({
  //   ...config,
  //   namespace,
  //   messages: config.messages,
  // });
  return { t: formatFn, messages: config.messages, locale };
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
  const opts = { ...runtimeConfig, locale };
  // return initializeConfig(opts);
  return opts;
});

// function initializeConfig({getMessageFallback, messages, onError, ...rest}: any) {
//   const finalOnError = onError || defaultOnError;
//   const finalGetMessageFallback =
//     getMessageFallback || defaultGetMessageFallback;

//   if (process.env.NODE_ENV !== 'production') {
//     if (messages) {
//       validateMessages(messages, finalOnError);
//     }
//   }

//   return {
//     ...rest,
//     messages,
//     onError: finalOnError,
//     getMessageFallback: finalGetMessageFallback
//   };
// }

export default cache(getTranslations);
