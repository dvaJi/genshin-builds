"use client";

import clsx from "clsx";
import { ReactNode } from "react";

import { usePopover } from "@hooks/use-popover";

type Props = {
  className?: string;
  contentsClassName?: string;
  children: ReactNode;
  contents: ReactNode;
};

function Tooltip({ className, contentsClassName, children, contents }: Props) {
  const [open, trigger, content, toggle] = usePopover<
    HTMLDivElement,
    HTMLDivElement
  >(false);

  return (
    <div
      className={clsx("w-full cursor-pointer", className)}
      {...trigger}
      onMouseLeave={() => toggle(false)}
      onMouseEnter={() => toggle(true)}
    >
      {children}
      <div
        {...content}
        className={clsx(
          "z-1000 max-w-xs rounded-md bg-vulcan-600 shadow-2xl",
          {
            hidden: !open,
          },
          contentsClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {contents}
      </div>
    </div>
  );
}

export default Tooltip;
