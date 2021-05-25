import useIntlContext from "./use-intl-context";
import { templateReplacement } from "@utils/template-replacement";
import Message from "@components/Message";

export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}

export interface useIntlResponse {
  t: (props: IntlFormatProps) => JSX.Element;
  tfn: (props: IntlFormatProps) => string;
}

const useIntl = (): useIntlResponse => {
  const { messages: dict = {} } = useIntlContext();

  const format = ({ id, defaultMessage, values }: IntlFormatProps) => (
    <Message
      id={id}
      defaultMessage={defaultMessage}
      dict={dict}
      values={values}
    />
  );

  const formatFn = ({ id, defaultMessage, values }: IntlFormatProps) => {
    if (dict[id]) {
      return values ? templateReplacement(dict[id], values) : dict[id];
    }

    return values
      ? templateReplacement(defaultMessage, values)
      : defaultMessage;
  };

  return { t: format, tfn: formatFn };
};

export default useIntl;
