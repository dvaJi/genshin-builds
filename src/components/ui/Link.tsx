import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  href: string;
  className?: string;
}

function Link({ children, ...props }: Props) {
  return <a {...props}>{children}</a>;
}

export default Link;
