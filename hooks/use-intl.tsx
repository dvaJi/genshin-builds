import Message from "../components/Message";

interface FormatProps {
  id: string;
  defaultMessage: string;
}

const useIntl = (
  dict: Record<string, string>
): [({ id, defaultMessage }: FormatProps) => JSX.Element] => {
  const format = ({ id, defaultMessage }: FormatProps) => (
    <Message id={id} defaultMessage={defaultMessage} dict={dict} />
  );

  return [format];
};

export default useIntl;
