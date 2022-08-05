import { ReactNode } from "react";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
}

const Badge = ({ children, className }: CollapsibleProps) => {
  return (
    <span
      className={clsx("bg-gray-600 rounded p-1 text-xs mr-1 font-bold", className)}
    >
      {children}
    </span>
  );
};

export default Badge;
