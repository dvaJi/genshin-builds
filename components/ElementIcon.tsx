import { memo } from "react";

const ElementIcon = ({
  type,
  ...props
}: { type: string } & React.HTMLAttributes<HTMLImageElement>) => {
  return <img src={`/elements/${type}.png`} {...props} />;
};

export default memo(ElementIcon);
