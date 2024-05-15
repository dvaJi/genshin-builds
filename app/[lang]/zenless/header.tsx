"use client";

import clsx from "clsx";
import { NavRoutes } from "interfaces/nav-routes";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

import GameSelector from "@components/GameSelector";
import NavItem from "@components/NavItem";
import { GAME } from "@utils/games";

const navRoutes: NavRoutes[] = [
  { id: "home", name: "Home", href: "/zenless" },
  { id: "characters", name: "Characters", href: "/zenless/characters" },
  { id: "bangboos", name: "Bangboos", href: "/zenless/bangboos" },
  { id: "disk-drives", name: "Disk Drives", href: "/zenless/disk-drives" },
  { id: "w-engines", name: "W Engines", href: "/zenless/w-engines" },
  { id: "blog", name: "Blog", href: "/zenless/blog" },
];

type Props = {
  locale: string;
};

export default function ZenlessHeader({ locale }: Props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <header className="z-50 bg-zinc-950 px-4 lg:mx-0">
      <div className="container mx-auto flex justify-between py-2">
        <div className="flex w-full items-center justify-between pr-4 md:inline-block md:w-auto md:pr-0">
          <h1 className="text-xl md:py-5">
            <Link href={`/${locale}/zenless`} prefetch={false}>
              ZenlessBuilds
            </Link>
          </h1>
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
            "absolute left-0 top-10 z-10 block max-h-[80vh] w-screen overflow-auto bg-zinc-800 pb-4 pt-2 md:relative md:top-0 md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0",
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
              currentGame={GAME.ZENLESS}
              className="z-40 text-slate-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
