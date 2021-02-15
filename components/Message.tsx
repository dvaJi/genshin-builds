import { templateReplacement } from "@utils/template-replacement";
import { memo } from "react";

const Message = ({
  id,
  defaultMessage,
  dict,
  values,
}: {
  id: string;
  defaultMessage: string;
  dict: Record<string, string>;
  values?: Record<string, string>;
}) => {
  if (dict[id]) {
    return values ? (
      <>{templateReplacement(dict[id], values)}</>
    ) : (
      <>{dict[id]}</>
    );
  } else {
    return <>{defaultMessage}</>;
  }
};

export default memo(Message);
