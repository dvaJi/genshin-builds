import { memo, ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

interface SidebarLinkProps {
  children: ReactNode;
  href: string;
  route: string;
  icon: ReactNode;
}

const SidebarLink = ({ children, href, icon, route }: SidebarLinkProps) => {
  const isActive = route === href;
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
          className={clsx(
            "inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-black dark:hover:text-white",
            isActive ? "text-gray-800 dark:text-gray-200" : ""
          )}
        >
          <div className="text-2xl">{icon}</div>
          <span className="ml-4">{children}</span>
        </a>
      </Link>
    </li>
  );
};

export default memo(SidebarLink);
