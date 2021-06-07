import useIntlContext from "./use-intl-context";
import { templateReplacement } from "@utils/template-replacement";

export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}

export interface useIntlResponse {
  t: (props: IntlFormatProps) => string;
  tfn: (props: IntlFormatProps) => string;
}

const useIntl = (): useIntlResponse => {
  const { messages: dict = {} } = useIntlContext();

  const formatFn = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (dict[id]) {
      return values ? templateReplacement(dict[id], values) : dict[id];
    }

    return values
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  return { t: formatFn, tfn: formatFn };
};

export default useIntl;
