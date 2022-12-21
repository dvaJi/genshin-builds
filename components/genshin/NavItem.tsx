import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import useIntl from "@hooks/use-intl";

type Route = {
  id: string;
  name: string;
  href?: string;
  children?: Route[];
  icon?: JSX.Element;
};

type Props = {
  route: Route;
};

function NavItem({ route }: Props) {
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
    >
      {!route.children ? (
        <Link
          className="ml-4 mt-4 block font-semibold text-slate-300 hover:text-slate-50 md:mt-0 md:ml-0 md:py-2 md:px-3"
          href={route.href!}
        >
          {route.name}
        </Link>
      ) : (
        <>
          <span
            className={clsx(
              "mt-6 ml-4 block cursor-default text-xs font-semibold uppercase text-slate-500 md:ml-0 md:mt-0 md:mr-1 md:inline-block md:py-2 md:px-3 md:text-sm md:normal-case md:text-slate-300",
              { "md:text-white": isHovering }
            )}
          >
            {route.name}
          </span>
          <div
            className={clsx(
              "transform px-0 text-xs transition-all md:pointer-events-none md:absolute md:z-10 md:mt-4 md:ml-0 md:-translate-y-1 md:px-0  md:opacity-0",
              {
                "md:pointer-events-auto md:translate-y-0 md:opacity-100":
                  isHovering,
              }
            )}
          >
            <div className="mt-2 max-h-[calc(100vh-80px)] min-w-[140px] overflow-y-auto overflow-x-hidden md:mt-0 md:w-[650px] md:max-w-[calc(100vw-250px)] md:rounded-sm md:border md:border-vulcan-800 md:bg-vulcan-800 md:shadow-xl">
              <div className="px-4 pb-2 pt-2">
                <div className="grid gap-0 md:grid-cols-2">
                  {route.children.map((child) => (
                    <Link
                      key={child.id}
                      className="mb-2 flex transition-all opacity-80 hover:opacity-100 items-center rounded-sm border border-transparent text-sm text-slate-200 md:mb-0 md:ml-0 md:items-start md:p-4 md:transition-none"
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
