import { ReactNode } from "react";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className }: CollapsibleProps) => {
  return (
    <span
      className={clsx(
        "mr-1 rounded border border-gray-500/40 bg-gray-600/70 p-1 text-xs font-bold",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
