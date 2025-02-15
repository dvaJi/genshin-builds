"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export type RouteChild = {
  id: string;
  name: string;
  href: string;
};

export type RouteType = {
  id: string;
  name: string;
  href?: string;
  children?: RouteChild[];
  icon?: React.ReactNode;
  isNew?: boolean;
};

const NavItem = ({ route }: { route: RouteType }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const closeMobileNav = () => {
    if (!isMobile) return;
    const mobileNavContent = document.querySelector(".mobile-nav-content");
    if (!mobileNavContent) return;

    const backdropClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    mobileNavContent.dispatchEvent(backdropClick);
  };

  // Mobile dropdown
  if (route.children && isMobile) {
    return (
      <div className="relative px-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={clsx(
            "collapsible-trigger flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isOpen
              ? "bg-accent text-accent-foreground"
              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <span className="flex items-center gap-2">
            {route.icon}
            {route.name}
          </span>
          <IoChevronDown
            className={clsx("h-4 w-4 transition-transform", {
              "rotate-180": isOpen,
            })}
          />
        </button>
        {isOpen && (
          <div
            className="mt-1 space-y-1 px-3"
            onClick={(e) => e.stopPropagation()}
          >
            {route.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                className={clsx(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-accent/50 text-accent-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={closeMobileNav}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop navigation
  if (route.children) {
    return (
      <div className="group relative">
        <button
          className={clsx(
            "flex h-14 items-center gap-2 px-4 text-sm transition-colors",
            pathname?.startsWith(route.href || "")
              ? "text-foreground"
              : "text-foreground/70 hover:text-foreground",
          )}
        >
          {route.icon}
          {route.name}
          <IoChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
        </button>
        <div className="invisible absolute left-0 top-full z-50 w-48 translate-y-1 opacity-0 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-lg border border-border bg-card p-2 shadow-lg">
            {route.children.map((child) => (
              <Link
                key={child.id}
                href={child.href}
                className={clsx(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Simple link
  return (
    <Link
      href={route.href || "#"}
      className={clsx(
        "flex h-14 items-center gap-2 px-3 text-sm transition-colors md:px-2",
        pathname === route.href
          ? "text-foreground"
          : "text-foreground/70 hover:text-foreground",
      )}
      onClick={closeMobileNav}
    >
      {route.icon}
      {route.name}
      {route.isNew && (
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium uppercase text-primary">
          New
        </span>
      )}
    </Link>
  );
};

export default NavItem;
