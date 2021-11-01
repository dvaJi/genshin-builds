import clsx from "clsx";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="flex flex-1 relative items-center bg-vulcan-900 rounded-2xl h-12 focus-within:border-vulcan-500 border-2 border-transparent ease-in duration-100 mb-2">
        <input
          ref={ref}
          className={clsx(
            "w-full pl-4 min-h-full pr-4 text-white placeholder-gray-500 leading-none bg-transparent border-none focus:outline-none",
            className
          )}
          {...props}
        >
          {children}
        </input>
      </div>
    );
  }
);

export default Input;
