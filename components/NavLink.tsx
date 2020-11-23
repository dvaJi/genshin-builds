import { memo, ReactNode, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

interface NavLinkDropwdown {
  name: string;
  href: string;
}

interface NavLinkProps {
  children: ReactNode;
  href: string;
  route: string;
  dropdownMenu?: NavLinkDropwdown[];
}

const NavLink = ({ children, href, route, dropdownMenu }: NavLinkProps) => {
  const [isHover, setIsHover] = useState(false);
  const isActive = route === href;
  return (
    <li
      className="flex items-center content-center m-0"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link href={href}>
        <a
          className={clsx(
            "flex items-center relative h-full text-sm text-center px-9 transition-all hover:text-black dark:hover:text-white",
            isActive ? "text-gray-800 dark:text-gray-200" : ""
          )}
        >
          {children}
        </a>
      </Link>
      {dropdownMenu && isHover ? (
        <div
          className="absolute top-full m-0 py-4 bg-white dark:bg-vulcan-800 border-r border-l border-b border-gray-200 dark:border-gray-800 shadow-md"
          aria-labelledby="navbarDropdown"
        >
          {dropdownMenu.map((dm) => (
            <Link key={dm.href} href={dm.href}>
              <a
                className={clsx(
                  "flex items-center relative h-full text-center transition-all py-3 px-6 content-start text-sm hover:text-black dark:hover:text-white",
                  route === dm.href ? "text-gray-800 dark:text-gray-200" : ""
                )}
              >
                {dm.name}
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div />
      )}
    </li>
  );
};

export default memo(NavLink);
