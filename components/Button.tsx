import { ReactNode } from "react";
import classd from "../utils/classd";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  type?: "solid" | "outline";
  color?: "primary" | "secondary";
}

export const Button: React.FC<
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
      className={classd(
        "focus:outline-none focus:shadow-outline-purple text-white py-2 px-4 border border-transparent",
        className,
        color === "primary" ? "hover:bg-purple-700" : "hover:bg-gray-700",
        type === "solid"
          ? color === "primary"
            ? "bg-purple-600"
            : "bg-gray-600"
          : "",
        isActive ? (color === "primary" ? "bg-purple-800" : "bg-gray-800") : ""
      )}
      {...props}
    >
      {children}
    </button>
  );
};
