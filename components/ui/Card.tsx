import { ReactNode } from "react";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CollapsibleProps) => {
  return (
    <div
      className={clsx(
        "min-w-0 p-4 mt-4 rounded-lg ring-1 ring-gray-700 ring-opacity-60 bg-vulcan-800 shadow-lg relative",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
