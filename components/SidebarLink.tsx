import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import classd from "../utils/classd";

interface SidebarLinkProps {
  children: ReactNode;
  href: string;
  icon: ReactNode;
}

export const SidebarLink = ({ children, href, icon }: SidebarLinkProps) => {
  const router = useRouter();
  const isActive = router.route === href;
  return (
    <li className="relative px-6 py-3">
      {isActive && (
        <span
          className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
          aria-hidden="true"
        ></span>
      )}
      <Link href={href}>
        <a
          className={classd(
            "inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200",
            isActive ? "text-gray-100" : ""
          )}
        >
          <div className="text-2xl">{icon}</div>
          <span className="ml-4">{children}</span>
        </a>
      </Link>
    </li>
  );
};
