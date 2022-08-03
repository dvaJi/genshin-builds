import Link from "next/link";
import { memo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

import NavLink from "./NavLink";
import Logo from "./Logo";
import { NavRoutes } from "interfaces/nav-routes";
import useIntl from "@hooks/use-intl";

const MobileNav = dynamic(() => import("./MobileNav"), {
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
    <nav className="sticky top-0 h-12 mb-5 z-40 backdrop-blur bg-vulcan-800/70 border-b border-gray-700 border-opacity-60 shadow-md">
      <div className="flex h-full mb-12 mx-auto container text-gray-400 ">
        <Link href="/">
          <a className="flex items-center font-bold mr-6" aria-current="page">
            <Logo />
          </a>
        </Link>
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
          className="flex items-center overflow-visible m-0 p-6 cursor-pointer z-50 lg:hidden ml-auto"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <div>{isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}</div>
        </div>
      </div>
      <MobileNav
        isOpen={isMobileNavOpen}
        navroutes={navroutes}
        handleClick={setIsMobileNavOpen}
        f={t}
      />
    </nav>
  );
};

export default memo(LayoutHeader);
