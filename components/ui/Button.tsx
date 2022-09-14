import clsx from "clsx";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled = false, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        className={clsx(
          className,
          "bg-vulcan-700 rounded py-2 px-4 ease-in duration-100 hover:bg-vulcan-600 focus:bg-vulcan-900",
          { "pointer-events-none": disabled, "opacity-50": disabled }
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
