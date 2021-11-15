import useIntlContext from "./use-intl-context";
import { templateReplacement } from "@utils/template-replacement";
import { localeToLang } from "@utils/locale-to-lang";

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

const useIntl = (): useIntlResponse => {
  const { messages: dict = {}, locale } = useIntlContext();

  const formatFn = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (dict[id]) {
      return values ? templateReplacement(dict[id], values) : dict[id];
    }

    return values
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  return { t: formatFn, tfn: formatFn, locale, localeGI: localeToLang(locale) };
};

export default useIntl;
