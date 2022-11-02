import { ReactNode } from "react";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
  ref?: any;
}

const Card = ({ children, className, ref }: CollapsibleProps) => {
  return (
    <div
      className={clsx(
        "min-w-0 mt-4 rounded-lg ring-1 ring-gray-700 ring-opacity-60 bg-vulcan-800 shadow-lg relative",
        className?.includes("p-0") ? "" : "p-4",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default Card;
