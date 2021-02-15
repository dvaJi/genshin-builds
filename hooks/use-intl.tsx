import { templateReplacement } from "@utils/template-replacement";
import Message from "../components/Message";

export interface IntlFormatProps {
  id: string;
  defaultMessage: string;
  values?: Record<string, string>;
}

const useIntl = (
  dict: Record<string, string>
): [
  (props: IntlFormatProps) => JSX.Element,
  (props: IntlFormatProps) => string
] => {
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

    return defaultMessage;
  };

  return [format, formatFn];
};

export default useIntl;
