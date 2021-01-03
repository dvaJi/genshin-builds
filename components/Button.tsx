import { memo, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  type?: "solid" | "outline";
  color?: "primary" | "secondary";
}

const Button: React.FC<
  ButtonProps & React.HTMLAttributes<HTMLButtonElement>
> = ({
  children,
  className = "",
  isActive = false,
  type = "solid",
  color = "primary",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center h-full cursor-pointer bg-transparent focus:outline-none focus:ring focus:ring-purple-900 transition-all overflow-hidden relative text-white px-4 border hover:bg-gray-800 border-gray-800 hover:border-purple-900",
        className,
        // color === "primary" ? "hover:bg-purple-700" : "hover:bg-gray-700",
        // type === "solid"
        //   ? color === "primary"
        //     ? "bg-purple-600"
        //     : "bg-gray-600"
        //   : "",
        isActive
          ? color === "primary"
            ? "text-white bg-purple-800"
            : "bg-gray-800"
          : "text-gray-700"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default memo(Button);
