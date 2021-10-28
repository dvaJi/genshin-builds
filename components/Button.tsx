import clsx from "clsx";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={clsx(
          "bg-vulcan-700 hover:bg-vulcan-600 focus:bg-vulcan-900 rounded py-2 px-4",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
