"use client";

import clsx from "clsx";
import { NavRoutes } from "interfaces/nav-routes";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem from "@components/NavItem";
import Logo from "@components/wuthering-waves/Logo";
import { GAME } from "@utils/games";

const navRoutes: NavRoutes[] = [
  { id: "characters", name: "Characters", href: "/wuthering-waves" },
  { id: "echoes", name: "Echoes", href: "/wuthering-waves/echoes" },
  { id: "weapons", name: "Weapons", href: "/wuthering-waves/weapons" },
  { id: "gear-sets", name: "Gear Sets", href: "/wuthering-waves/gear-sets" },
];

type Props = {
  locale: string;
};

export default function WWHeader({ locale }: Props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <div className="bg-ww-950 border-ww-900 relative left-0 top-0 z-50 w-full border-b shadow-md backdrop-blur md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center px-4 py-2 text-sm md:flex md:py-0 ">
        <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
          <Link href={`/${locale}/wuthering-waves`} className="h-full w-full">
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
            "bg-ww-950 absolute left-0 z-10 mt-2 block max-h-[80vh] w-screen overflow-auto pb-4 pt-2 md:relative md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0",
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
            <GameSelector currentGame={GAME.WUTHERING} className="text-ww-100 z-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
