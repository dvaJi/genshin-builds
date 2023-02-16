export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}

let dict = {};

const loadLocale = async (locale: string, game: string) => {
  if (dict[locale]) {
    return dict[locale];
  }
  const locales = await import(`../locales/${game}/${locale}.json`);
  dict[locale] = locales;

  return dict[locale];
};

export const intl = async (locale: string, game: string, namespace: string) => {
  const locales = await loadLocale(locale, game);

  const dict = locales[namespace];

  const templateReplacement = (
    template: string,
    data: Record<string, string>
  ) => {
    const pattern = /{\s*(\w+?)\s*}/g;
    return template.replace(pattern, (_, token) => data[token] || "");
  };

  const t = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (dict[id]) {
      return values ? templateReplacement(dict[id], values) : dict[id];
    }

    if (import.meta.env.DEV) {
      console.warn(
        `[useIntl] Missing translation for "${id}" in "${locale}" locale, ${namespace}.`
      );
    }

    return defaultMessage;
  };

  return { t };
};
