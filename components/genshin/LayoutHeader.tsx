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
  { id: "characters", name: "Characters", href: "/characters" },
  {
    id: "tierlist",
    name: "Tierlist",
    href: "/#",
    dropdownMenu: [
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
  { id: "teams", name: "Teams", href: "/teams" },
  { id: "todo", name: "Todo", href: "/todo" },
  { id: "calculator", name: "Calculator", href: "/calculator" },
  { id: "guides", name: "Guides", href: "/guides" },
  {
    id: "database",
    name: "Database",
    href: "/#",
    dropdownMenu: [
      { id: "weapons", name: "Weapons", href: "/weapons" },
      { id: "artifacts", name: "Artifacts", href: "/artifacts" },
      { id: "materials", name: "Materials", href: "/materials" },
      { id: "achievements", name: "Achievements", href: "/achievements" },
      {
        id: "cooking_ingredient",
        name: "Cooking Ingredient",
        href: "/ingredients",
      },
      { id: "food", name: "Food", href: "/food" },
      { id: "potions", name: "Potions", href: "/potions" },
      { id: "fishing", name: "Fishing", href: "/fishing" },
    ],
  },
  // { name: "Team Builder", href: "/comp-builder" },
];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const { t } = useIntl("layout");
  return (
    <nav className="sticky top-0 z-40 h-12 border-b border-gray-700 border-opacity-60 bg-vulcan-800/70 shadow-md backdrop-blur">
      <div className="container mx-auto mb-12 flex h-full text-gray-400 ">
        <Link
          href="/"
          className="mr-6 flex items-center font-bold"
          aria-current="page"
        >
          <Logo />
        </Link>
        <GameSelector currentGame={GAME.GENSHIN} className="hidden md:block" />
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
        game={GAME.GENSHIN}
        handleClick={setIsMobileNavOpen}
        f={t}
      />
    </nav>
  );
};

export default memo(LayoutHeader);
