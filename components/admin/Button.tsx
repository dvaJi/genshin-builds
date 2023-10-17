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
            "border-zinc-500 bg-zinc-900 hover:border-zinc-200":
              state === "secondary",
            "border-blue-600 bg-blue-600 hover:bg-transparent hover:text-blue-600":
              state === "success",
            "border-yellow-600 bg-yellow-600 hover:bg-transparent hover:text-yellow-600":
              state === "warning",
            "border-red-600 bg-red-600 hover:bg-transparent hover:text-red-600":
              state === "error",
            "border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-zinc-200":
              state === "error_ghost",
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
