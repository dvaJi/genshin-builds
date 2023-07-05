import useIntl from "@hooks/use-intl";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

type Route = {
  id: string;
  name: string;
  href?: string;
  children?: Route[];
  icon?: JSX.Element;
  isNew?: boolean;
};

type Props = {
  route: Route;
  onClick?: () => void;
};

function NavItem({ route, onClick }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useIntl("layout");

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
          className="ml-4 mt-4 block font-semibold text-slate-300 hover:text-slate-50 md:ml-0 md:mt-0 md:px-3 md:py-2"
          href={route.href!}
        >
          {t({ id: route.id, defaultMessage: route.name })}
          {route.isNew && (
            <span className="absolute right-2 top-4 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
            </span>
          )}
        </Link>
      ) : (
        <>
          <span
            className={clsx(
              "ml-4 mt-6 block cursor-default text-xs font-semibold uppercase text-slate-500 md:ml-0 md:mr-1 md:mt-0 md:inline-block md:px-3 md:py-2 md:text-sm md:normal-case",
              isHovering ? "md:text-white" : "md:text-slate-300"
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
            className={clsx(
              "transform px-0 text-xs transition-all md:absolute md:z-10 md:ml-0 md:mt-4 md:px-0",
              isHovering
                ? "md:pointer-events-auto md:translate-y-0 md:opacity-100"
                : "md:pointer-events-none md:-translate-y-1 md:opacity-0"
            )}
          >
            <div className="mt-2 max-h-[calc(100vh-80px)] min-w-[140px] overflow-y-auto overflow-x-hidden md:mt-0 md:w-[650px] md:max-w-[calc(100vw-250px)] md:rounded-sm md:border md:border-vulcan-800 md:bg-vulcan-800 md:shadow-xl">
              <div className="px-4 pb-2 pt-2">
                <div className="grid gap-0 md:grid-cols-2">
                  {route.children.map((child) => (
                    <Link
                      key={child.id}
                      className="mb-2 flex items-center rounded-sm border border-transparent text-sm text-slate-200 opacity-80 transition-all hover:opacity-100 md:mb-0 md:ml-0 md:items-start md:p-4 md:transition-none"
                      href={child.href!}
                    >
                      <div className="mr-1 scale-75 transform rounded bg-vulcan-600 p-2 text-white md:mr-4 md:scale-100">
                        {child.icon}
                      </div>
                      <div>
                        <p className="mb-0 leading-4 md:font-semibold">
                          {t({ id: child.id, defaultMessage: child.name })}
                        </p>
                        <p className="mt-0.5 hidden text-xs text-slate-500 md:block">
                          {t({ id: `${child.id}_desc`, defaultMessage: "" })}
                        </p>
                      </div>
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
