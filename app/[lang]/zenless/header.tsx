"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem, { RouteType } from "@components/NavItem";
import { GAME } from "@utils/games";

const navRoutes: RouteType[] = [
  { id: "home", name: "Home", href: "/zenless" },
  { id: "characters", name: "Characters", href: "/zenless/characters" },
  { id: "bangboos", name: "Bangboos", href: "/zenless/bangboos" },
  { id: "disk-drives", name: "Disk Drives", href: "/zenless/disk-drives" },
  { id: "w-engines", name: "W Engines", href: "/zenless/w-engines" },
  { id: "tierlist", name: "Tierlist", href: "/zenless/tierlist" },
  { id: "blog", name: "Blog", href: "/zenless/blog" },
];

type Props = {
  locale: string;
};

export default function ZenlessHeader({ locale }: Props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const navigationRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (isMobileNavOpen) {
      scrollPosition.current = window.scrollY;
      document.documentElement.classList.add("mobile-nav-open");
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.documentElement.classList.remove("mobile-nav-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPosition.current);
    }
  }, [isMobileNavOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileNavOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!navigationRef.current) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -50) {
      handleClose();
    }
  };

  const handleNavContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(".collapsible-trigger") ||
      target.closest('[role="combobox"]') ||
      target.closest(".select-content")
    ) {
      e.stopPropagation();
      return;
    }
    if (target.closest("a") || target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <nav className="z-50 w-full border-b border-zinc-900 bg-zinc-950 shadow-md md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center px-2 py-1 text-sm sm:px-4 sm:py-2 md:flex md:py-0">
        <div className="flex h-12 items-center justify-between pr-2 sm:pr-4 md:inline-block md:h-auto md:pr-0">
          <div className="relative">
            <h1 className="text-xl md:py-5">
              <Link href={`/${locale}/zenless`} prefetch={false}>
                ZenlessBuilds
              </Link>
            </h1>
            <p className="absolute -bottom-2 text-xxs text-gray-400 md:bottom-2">
              by <Link href="/">genshin-builds.com</Link>
            </p>
          </div>
          <button
            role="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-transparent text-slate-200 transition-colors hover:bg-zinc-800 md:hidden"
            onClick={() =>
              isMobileNavOpen ? handleClose() : setIsMobileNavOpen(true)
            }
            title="Toggle Navigation"
            aria-label="Toggle Navigation"
          >
            <div className="text-xl">
              {isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </button>
        </div>
        <div
          ref={navigationRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={clsx(
            "mobile-nav-content fixed inset-x-0 top-[3.25rem] z-10 block max-h-[calc(100vh-3.25rem)] overflow-auto bg-zinc-900 pb-6 pt-2 shadow-lg sm:top-[3.75rem] sm:max-h-[calc(100vh-3.75rem)] md:relative md:inset-auto md:ml-10 md:mt-0 md:flex md:max-h-none md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:pb-0 md:pt-0 md:shadow-none",
            isMobileNavOpen && !isClosing && "animate-slide-in",
            isClosing && "animate-slide-out",
            !isMobileNavOpen &&
              !isClosing &&
              "pointer-events-none -translate-y-2 opacity-0",
            "md:pointer-events-auto md:translate-y-0 md:opacity-100",
          )}
          onClick={handleNavContentClick}
        >
          <ul className="flex flex-col space-y-1 px-2 md:flex-row md:space-y-0 md:px-0">
            {navRoutes.map((route, index) => (
              <div
                key={route.id}
                className={clsx(
                  "mobile-nav-item",
                  "md:transform-none md:opacity-100",
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <NavItem route={route} />
              </div>
            ))}
          </ul>
          <div
            className="mt-4 px-2 md:mt-0 md:flex md:items-center md:px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <GameSelector
              currentGame={GAME.ZENLESS}
              className="z-40 text-slate-200"
            />
          </div>
        </div>
      </div>

      {(isMobileNavOpen || isClosing) && (
        <div
          className={clsx(
            "fixed inset-0 z-0 bg-zinc-950/80 backdrop-blur-sm md:hidden",
            isMobileNavOpen && !isClosing && "animate-fade-in",
            isClosing && "animate-fade-out",
          )}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
