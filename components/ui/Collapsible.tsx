import { memo, ReactNode } from "react";
import { MdExpandMore } from "react-icons/md";
import clsx from "clsx";
import { useToggle } from "@hooks/use-toggle";

interface CollapsibleProps {
  text: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const Collapsible = ({
  children,
  text,
  className,
  defaultOpen = false,
}: CollapsibleProps) => {
  const [isOpen, toggle] = useToggle(defaultOpen);

  return (
    <div className={clsx("rounded", className)}>
      <div
        className="w-full py-1 px-2 hover:bg-vulcan-700 rounded cursor-pointer relative"
        onClick={toggle}
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
