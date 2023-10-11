import clsx from "clsx";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  state?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, disabled = false, state = "default", ...props },
    ref
  ) => {
    return (
      <button
        type="button"
        ref={ref}
        className={clsx(
          className,
          "flex items-center justify-center rounded-md border px-3 py-2 font-medium transition-all",
          {
            "border-white bg-white text-zinc-700 hover:border-zinc-200 hover:bg-zinc-200":
              state === "default",
            "bg-zinc-900": state === "secondary",
            "bg-blue-600": state === "success",
            "bg-yellow-600": state === "warning",
            "bg-red-600": state === "error",
            "bg-white ": state === "abort",
          },
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
