"use client";

import clsx from "clsx";
import { NavRoutes } from "interfaces/nav-routes";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem from "@components/wuthering-waves/NavItem";
import Logo from "@components/wuthering-waves/Logo";
import { GAME } from "@utils/games";

const navRoutes: NavRoutes[] = [
  { id: "characters", name: "Characters", href: "/wuthering-waves" },
  { id: "echoes", name: "Echoes", href: "/wuthering-waves/echoes" },
  { id: "weapons", name: "Weapons", href: "/wuthering-waves/weapons" },
  { id: "inventory", name: "Inventory", href: "/wuthering-waves/items" },
  {
    id: "tierlist",
    name: "Tier List",
    children: [
      {
        id: "tierlist_characters",
        name: "Characters Tier List",
        href: "/wuthering-waves/tierlist/characters",
      },
      {
        id: "tierlist_weapons",
        name: "Weapons Tier List",
        href: "/wuthering-waves/tierlist/weapons",
      },
      {
        id: "tierlist_echoes",
        name: "Echoes Tier List",
        href: "/wuthering-waves/tierlist/echoes",
      }
    ],
  },
];

type Props = {
  locale: string;
};

export default function WWHeader({ locale }: Props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <div className="relative left-0 top-0 z-50 w-full border-b border-ww-900 bg-ww-950 shadow-md backdrop-blur md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center px-4 py-2 text-sm md:flex md:py-0">
        <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
          <Link
            href={`/${locale}/wuthering-waves`}
            className="h-full w-full"
            prefetch={false}
          >
            <Logo />
          </Link>
          <button
            role="button"
            className="z-50 md:hidden"
            onClick={() => setIsMobileNavOpen((a) => !a)}
            title="Toggle Navigation"
            aria-label="Toggle Navigation"
          >
            <div className="h-4 w-6 text-xl text-white">
              {isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </button>
        </div>
        <div
          className={clsx(
            "absolute left-0 z-10 mt-2 block max-h-[80vh] w-screen overflow-auto bg-ww-950 pb-4 pt-2 md:relative md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0",
            { hidden: !isMobileNavOpen }
          )}
        >
          <ul className="flex flex-col md:flex-row">
            {navRoutes.map((route, i) => (
              <div key={route.id} onClick={() => setIsMobileNavOpen(false)}>
                <NavItem route={route} position={i + 1 / navRoutes.length} />
              </div>
            ))}
          </ul>
          <div className="mt-4">
            <GameSelector
              currentGame={GAME.WUTHERING}
              className="z-40 text-ww-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
