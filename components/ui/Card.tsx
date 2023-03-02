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
        "card",
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
