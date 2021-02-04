import { memo, ReactNode, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import clsx from "clsx";

interface CollapsibleProps {
  text: ReactNode;
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
}

const Collapsible = ({ children, text, className }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={clsx(
        "bg-gray-800 border border-gray-900 mb-2 rounded",
        className
      )}
    >
      <div
        className="w-full py-1 px-2 hover:bg-gray-700 rounded cursor-pointer relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-full">{text}</span>
        <span
          className={clsx("absolute top-1/3 right-4 transition transform", {
            "rotate-180": isOpen,
          })}
        >
          <MdExpandMore />
        </span>
      </div>
      <div className={clsx("py-3 px-2", { hidden: !isOpen })}>{children}</div>
    </div>
  );
};

export default memo(Collapsible);
