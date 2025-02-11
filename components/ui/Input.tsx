import clsx from "clsx";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "input",
          "bg-background flex h-9 w-full rounded-md px-3 py-1 text-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border-destructive ring-destructive": error,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
