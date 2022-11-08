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
      className="m-0 flex content-center items-center"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {dropdownMenu ? (
        <div
          className={clsx(
            "relative flex h-full cursor-pointer items-center px-9 text-center text-sm transition-all hover:text-white",
            isActive ? "text-gray-200" : ""
          )}
        >
          {children}
        </div>
      ) : (
        <Link
          href={href}
          className={clsx(
            "relative flex h-full items-center px-9 text-center text-sm transition-all hover:text-white",
            isActive ? "text-gray-200" : ""
          )}
        >
          {children}
        </Link>
      )}
      {dropdownMenu && isHover ? (
        <div
          className="absolute top-full m-0 border-r border-l border-b border-gray-800 bg-vulcan-800 py-4 shadow-md"
          aria-labelledby="navbarDropdown"
        >
          {dropdownMenu.map((dm) => (
            <Link
              key={dm.href}
              href={dm.href}
              className={clsx(
                "relative flex h-full content-start items-center py-3 px-6 text-center text-sm transition-all hover:text-white",
                route === dm.href ? "text-gray-200" : ""
              )}
            >
              {dm.name}
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
