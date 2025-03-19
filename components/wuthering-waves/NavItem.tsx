"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";

type Route = {
  id: string;
  name: string;
  href?: string;
  children?: Route[];
  icon?: React.ReactNode;
  isNew?: boolean;
};

type Props = {
  route: Route;
  position: number;
  onClick?: () => void;
};

function NavItem({ route, position, onClick }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const t = useTranslations("WW.layout");
  const pathname = usePathname();

  const isActive = useMemo(() => {
    const pathWithoutLang = "/" + pathname.split("/").slice(2).join("/");

    return route.href
      ? route.href === pathname
      : route.children?.some((child) => child.href === pathWithoutLang);
  }, [pathname, route.children, route.href]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <li
      key={route.id}
      className="group relative md:py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {!route.children ? (
        <Link
          className={cn(
            "ml-4 mt-4 block font-semibold hover:text-ww-50 md:ml-0 md:mt-0 md:px-3 md:py-2",
            isActive ? "text-white" : "text-ww-300",
          )}
          href={route.href!}
        >
          {t(route.id)}
          {route.isNew && (
            <span className="absolute right-2 top-4 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ww-100 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ww-50"></span>
            </span>
          )}
        </Link>
      ) : (
        <>
          <span
            className={cn(
              "ml-4 mt-6 block cursor-default text-xs font-semibold uppercase md:ml-0 md:mr-1 md:mt-0 md:inline-block md:px-3 md:py-2 md:text-sm md:normal-case",
              isHovering ? "md:text-white" : "md:text-ww-300",
              isActive ? "text-white md:text-white" : "text-slate-500",
            )}
          >
            {route.name}
            {route.isNew && (
              <span className="absolute left-1 top-1 flex h-2 w-2 md:top-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
              </span>
            )}
          </span>
          <div
            className={cn(
              "transform px-0 text-xs transition-all md:absolute md:z-10 md:ml-0 md:mt-4 md:px-0",
              isHovering
                ? "md:pointer-events-auto md:translate-y-0 md:opacity-100"
                : "md:pointer-events-none md:-translate-y-1 md:opacity-0",
              {
                "md:right-0": position > 0.7,
                "-md:left-10": position > 0.5 && position <= 0.7,
                "-md:left-0": position <= 0.5,
              },
            )}
          >
            <div className="mt-2 max-h-[calc(100vh-80px)] min-w-[140px] overflow-y-auto overflow-x-hidden md:mt-0 md:w-[650px] md:max-w-[calc(100vw-600px)] md:rounded-sm md:border md:border-t-0 md:border-ww-800 md:bg-ww-950 md:shadow-xl xl:max-w-[calc(100vw-250px)]">
              <div className="px-4 pb-2 pt-2">
                <div className="grid gap-0 md:grid-cols-2">
                  {route.children.map((child) => (
                    <Link
                      key={child.id}
                      className="mb-2 rounded-sm text-sm text-ww-100 transition-colors hover:bg-ww-900 md:p-4"
                      href={child.href!}
                    >
                      <div className="capitalize md:font-semibold">
                        {t(child.id)}
                      </div>
                      <p className="hidden text-xs text-ww-400 md:block">
                        {t(`${child.id}_desc`)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </li>
  );
}

export default NavItem;
