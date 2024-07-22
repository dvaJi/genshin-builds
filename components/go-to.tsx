"use client";

import { useRouter } from "next/navigation";

type Props = {
  elementId: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export default function GoTo({ elementId, children, ...props }: Props) {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
  };

  return (
    <div role="button" onClick={() => handleNavigation(elementId)} {...props}>
      {children}
    </div>
  );
}
