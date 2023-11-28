"use client";

import clsx from "clsx";
import Link from "next/link";
import { memo, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem from "@components/NavItem";
import Logo from "@components/genshin/Logo";

import { GAME } from "@utils/games";

type Route = {
  id: string;
  name: string;
  href?: string;
  children?: Route[];
  icon?: JSX.Element;
  isNew?: boolean;
};

const navRoutes: Route[] = [
  { id: "characters", name: "Characters", href: "/characters" },
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
    ],
  },
];

const GenshinLayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="relative left-0 top-0 z-50 w-full border-b border-vulcan-700 bg-vulcan-800/70 shadow-md backdrop-blur md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center px-4 py-2 text-sm md:flex md:py-0 ">
        <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
          <Link href="/" className="h-full w-full">
            <Logo />
          </Link>
          <button
            className="z-50 md:hidden"
            onClick={() => setIsMobileNavOpen((a) => !a)}
          >
            <div className="h-4 w-6 text-xl text-white">
              {isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </button>
        </div>
        <div
          className={clsx(
            "absolute left-0 z-10 mt-2 block max-h-[80vh] w-screen overflow-auto bg-vulcan-800 pb-4 pt-2 md:relative md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0",
            { hidden: !isMobileNavOpen }
          )}
        >
          <ul className="flex flex-col md:flex-row">
            {navRoutes.map((route, i) => (
              <div key={route.id} onClick={() => setIsMobileNavOpen(false)}>
                <NavItem route={route} position={(i + 1) / navRoutes.length} />
              </div>
            ))}
          </ul>
          <div className="mt-4">
            <GameSelector
              currentGame={GAME.GENSHIN}
              className="z-40 text-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(GenshinLayoutHeader);
