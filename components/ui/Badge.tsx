import clsx from "clsx";
import { ReactNode } from "react";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
  textSize?: string;
}

const Badge = ({ children, className, textSize = "xs" }: CollapsibleProps) => {
  return (
    <span
      className={clsx(
        "mr-1 rounded border border-border bg-muted p-1 font-bold",
        `text-${textSize}`,
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
