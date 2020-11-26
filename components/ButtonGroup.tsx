import clsx from "clsx";
import { Children, cloneElement, ReactElement, ReactNode } from "react";

interface ButtonGroupProps {
  children: ReactNode;
}

const roundEnds = (size: number) => (child: ReactElement, index: number) => {
  let roundClass = "";
  let rightBorder = "border-r-0";
  if (index === 0) {
    roundClass = "rounded-l-lg";
  } else if (size - 1 === index) {
    roundClass = "rounded-r-lg";
    rightBorder = "";
  }
  const className = clsx(child.props.className, roundClass, rightBorder);

  const props = {
    className,
  };

  return cloneElement(child, props);
};

const ButtonGroup = ({ children }: ButtonGroupProps) => {
  if (!children) {
    return <div>{""}</div>;
  }

  const childrenCount = Children.count(children);

  return (
    <div className="flex items-center rounded-lg">
      {childrenCount > 1
        ? Children.map(children as React.ReactElement, roundEnds(childrenCount))
        : children}
    </div>
  );
};

export default ButtonGroup;
