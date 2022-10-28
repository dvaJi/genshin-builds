import Link from "next/link";
import { memo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import NavLink from "../NavLink";
import Logo from "./Logo";
import { NavRoutes } from "interfaces/nav-routes";
import useIntl from "@hooks/use-intl";
import GameSelector from "@components/GameSelector";
import { GAME } from "@utils/games";

const MobileNav = dynamic(() => import("../MobileNav"), {
  ssr: false,
});

const navroutes: NavRoutes[] = [
  { id: "characters", name: "Characters", href: "/tof" },
  { id: "matrices", name: "Matrices", href: "/tof/matrices" },
];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const { t } = useIntl("layout");
  return (
    <nav className="sticky top-0 z-40 mb-5 h-12 border-b border-gray-700 border-opacity-60 bg-vulcan-800/70 shadow-md backdrop-blur">
      <div className="container mx-auto mb-12 flex h-full text-gray-400 ">
        <Link
          href="/"
          className="mr-6 flex items-center font-bold text-white"
          aria-current="page"
        >
          <Logo />
        </Link>
        <GameSelector currentGame={GAME.TOF} className="hidden md:block" />
        <ul className="ml-auto hidden lg:flex">
          {navroutes.map((r) => (
            <NavLink
              key={r.name}
              href={r.href}
              route={router.route}
              dropdownMenu={r.dropdownMenu?.map((d) => ({
                ...d,
                name: t({ id: d.id, defaultMessage: d.name }),
              }))}
            >
              {t({ id: r.id, defaultMessage: r.name })}
            </NavLink>
          ))}
        </ul>
        <div
          className="z-50 m-0 ml-auto flex cursor-pointer items-center overflow-visible p-6 lg:hidden"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <div>{isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}</div>
        </div>
      </div>
      <MobileNav
        isOpen={isMobileNavOpen}
        navroutes={navroutes}
        game={GAME.TOF}
        handleClick={setIsMobileNavOpen}
        f={t}
      />
    </nav>
  );
};

export default memo(LayoutHeader);
