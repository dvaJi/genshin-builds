import clsx from "clsx";
import Link from "next/link";
import { memo, useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import Logo from "@components/tof/Logo";
import NavItem from "@components/NavItem";
import GameSelector from "@components/GameSelector";

import { GAME } from "@utils/games";
import { NavRoutes } from "interfaces/nav-routes";

const navRoutes: NavRoutes[] = [
  { id: "characters", name: "Characters", href: "/tof" },
  { id: "matrices", name: "Matrices", href: "/tof/matrices" },
];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-vulcan-700 bg-vulcan-800/70 shadow-md backdrop-blur md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center py-2 px-4 text-sm md:flex md:py-0 ">
        <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
          <Link href="/tof" className="h-full w-full">
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
            {navRoutes.map((route) => (
              <div key={route.id} onClick={() => setIsMobileNavOpen(false)}>
                <NavItem route={route} />
              </div>
            ))}
          </ul>
          <GameSelector
            currentGame={GAME.TOF}
            className="z-40 text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(LayoutHeader);
