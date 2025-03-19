"use client";

import clsx from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem from "@components/NavItem";
import Logo from "@components/genshin/Logo";
import { Link } from "@i18n/navigation";
import "@styles/mobile-nav.css";
import { GAME } from "@utils/games";

type RouteChild = {
  id: string;
  name: string;
  href: string;
};

type Route = {
  id: string;
  name: string;
  href?: string;
  children?: RouteChild[];
  icon?: React.ReactNode;
  isNew?: boolean;
};

const navRoutes: Route[] = [
  { id: "characters", name: "Characters", href: "/characters" },
  { id: "builds", name: "Builds", href: "/builds" },
  { id: "teams", name: "Teams", href: "/teams" },
  { id: "blog", name: "Blog", href: "/genshin/blog" },
  {
    id: "tcg",
    name: "TCG",
    children: [
      {
        id: "cards_list",
        name: "Cards List",
        href: "/tcg",
      },
      {
        id: "best_decks",
        name: "Best Decks",
        href: "/tcg/best-decks",
      },
      {
        id: "deck_builder",
        name: "Deck Builder",
        href: "/tcg/deck-builder",
      },
    ],
  },
  {
    id: "leaderboards",
    name: "Leaderboards",
    children: [
      {
        id: "profiles",
        name: "Profiles",
        href: "/profile",
      },
      {
        id: "leaderboard",
        name: "Leaderboard",
        href: "/leaderboard",
      },
      {
        id: "leaderboard_profiles",
        name: "Leaderboard Profiles",
        href: "/leaderboard/profiles",
      },
      // { id: "teams", name: "Teams", href: "/leaderboards/teams" },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    children: [
      { id: "todo", name: "Todo", href: "/todo" },
      {
        id: "calculator",
        name: "Calculator",
        href: "/calculator",
      },
      {
        id: "achievements",
        name: "Achievements",
        href: "/achievements",
      },
    ],
  },
  {
    id: "tierlist",
    name: "Tierlist",
    children: [
      {
        id: "tierlist_characters",
        name: "Tierlist Characters",
        href: "/tier-list",
      },
      {
        id: "tierlist_weapons",
        name: "Tierlist Weapons",
        href: "/tier-list-weapons",
      },
    ],
  },
  {
    id: "banners",
    name: "Banners",
    href: "/#",
    children: [
      {
        id: "banners_characters",
        name: "Banners Characters",
        href: "/banners/characters",
      },
      {
        id: "banners_weapons",
        name: "Banners Weapons",
        href: "/banners/weapons",
      },
    ],
  },
  {
    id: "wiki",
    name: "Wiki",
    children: [
      {
        id: "weapons",
        name: "Weapons",
        href: "/weapons",
      },
      {
        id: "artifacts",
        name: "Artifacts",
        href: "/artifacts",
      },
      {
        id: "materials",
        name: "Materials",
        href: "/materials",
      },
      {
        id: "cooking_ingredient",
        name: "Cooking Ingredient",
        href: "/ingredients",
      },
      { id: "food", name: "Food", href: "/food" },
      {
        id: "potions",
        name: "Potions",
        href: "/potions",
      },
      {
        id: "fishing",
        name: "Fishing",
        href: "/fishing",
      },
      {
        id: "sheets_tools",
        name: "Sheets Tools",
        href: "/sheets-tools",
      },
    ],
  },
];

const GenshinLayoutHeader = () => {
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

    // Only handle horizontal swipes that are more significant than vertical movement
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -50) {
      handleClose();
    }
  };

  const handleNavContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Don't close if clicking collapsible triggers or game selector
    if (
      target.closest(".collapsible-trigger") ||
      target.closest('[role="combobox"]') ||
      target.closest(".select-content")
    ) {
      e.stopPropagation();
      return;
    }

    // Close if clicking a link or outside menu items
    if (target.closest("a") || target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <nav className="sticky left-0 top-0 z-50 w-full border-b border-border bg-card/80 shadow-md backdrop-blur-md md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center px-2 py-1 text-sm sm:px-4 sm:py-2 md:flex md:py-0">
        <div className="flex h-12 items-center justify-between pr-2 sm:pr-4 md:inline-block md:h-auto md:pr-0">
          <Link href="/" className="flex h-full items-center">
            <Logo className="h-8 w-auto sm:h-10" />
          </Link>
          <button
            role="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-transparent text-foreground transition-colors hover:bg-accent md:hidden"
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
            "mobile-nav-content fixed inset-x-0 top-[3.25rem] z-10 block max-h-[calc(100vh-3.25rem)] overflow-auto bg-card pb-6 pt-2 shadow-lg sm:top-[3.75rem] sm:max-h-[calc(100vh-3.75rem)] md:relative md:inset-auto md:ml-10 md:mt-0 md:flex md:max-h-none md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:pb-0 md:pt-0 md:shadow-none",
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
            <GameSelector currentGame={GAME.GENSHIN} />
          </div>
        </div>
      </div>

      {/* Mobile Nav Backdrop */}
      {(isMobileNavOpen || isClosing) && (
        <div
          className={clsx(
            "fixed inset-0 z-0 bg-background/80 backdrop-blur-sm md:hidden",
            isMobileNavOpen && !isClosing && "animate-fade-in",
            isClosing && "animate-fade-out",
          )}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default memo(GenshinLayoutHeader);
