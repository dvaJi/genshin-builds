import { usePopover } from "@hooks/use-popover";
import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  contents: ReactNode;
};

function Tooltip({ className, children, contents }: Props) {
  const [open, trigger, content, toggle] = usePopover<
    HTMLDivElement,
    HTMLDivElement
  >(false);

  return (
    <div
      className={clsx("cursor-pointer", className)}
      {...trigger}
      onMouseLeave={() => toggle(false)}
      onMouseEnter={() => toggle(true)}
    >
      {children}
      <div
        {...content}
        className={clsx("bg-vulcan-600 rounded-md shadow-2xl z-1000 max-w-xs", {
          hidden: !open,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        {contents}
      </div>
    </div>
  );
}

export default Tooltip;
