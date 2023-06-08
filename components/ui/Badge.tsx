import { ReactNode } from "react";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
  textSize?: string;
}

const Badge = ({ children, className, textSize = 'xs' }: CollapsibleProps) => {
  return (
    <span
      className={clsx(
        "mr-1 rounded border border-gray-500/40 bg-gray-600/70 p-1 font-bold",
        `text-${textSize}`,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
