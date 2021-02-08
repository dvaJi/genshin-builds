import Message from "../components/Message";

interface FormatProps {
  id: string;
  defaultMessage: string;
}

const useIntl = (
  dict: Record<string, string>
): [(props: FormatProps) => JSX.Element, (props: FormatProps) => string] => {
  const format = ({ id, defaultMessage }: FormatProps) => (
    <Message id={id} defaultMessage={defaultMessage} dict={dict} />
  );

  const formatFn = ({ id, defaultMessage }: FormatProps) =>
    dict[id] ? dict[id] : defaultMessage;

  return [format, formatFn];
};

export default useIntl;
