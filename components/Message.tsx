import { memo } from "react";

const Message = ({
  id,
  defaultMessage,
  dict,
}: {
  id: string;
  defaultMessage: string;
  dict: Record<string, string>;
}) => {
  if (dict[id]) {
    return <>{dict[id]}</>;
  } else {
    return <>{defaultMessage}</>;
  }
};

export default memo(Message);
