import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import NavLink from "./NavLink";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { NavRoutes } from "interfaces/nav-routes";
import useIntl from "@hooks/use-intl";

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
  {
    id: "database",
    name: "Database",
    href: "/#",
    dropdownMenu: [
      { id: "weapons", name: "Weapons", href: "/weapons" },
      { id: "artifacts", name: "Artifacts", href: "/artifacts" },
      {
        id: "cooking_ingredient",
        name: "Cooking Ingredient",
        href: "/ingredients",
      },
      { id: "food", name: "Food", href: "/food" },
      { id: "potions", name: "Potions", href: "/potions" },
    ],
  },
  // { name: "Team Builder", href: "/comp-builder" },
];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  const { t, tfn } = useIntl();
  return (
    <nav className="sticky top-0 h-12 mb-5 z-40 bg-vulcan-800 border-b border-gray-800 shadow-md">
      <div className="flex h-full mb-12 mx-auto container text-gray-400 ">
        <a
          className="flex items-center font-bold mr-6"
          aria-current="page"
          href="/"
        >
          <Logo />
        </a>
        <ul className="ml-auto hidden lg:flex">
          {navroutes.map((r) => (
            <NavLink
              key={r.name}
              href={r.href}
              route={router.route}
              dropdownMenu={r.dropdownMenu?.map((d) => ({
                ...d,
                name: tfn({ id: d.id, defaultMessage: d.name }),
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
          <motion.div
            initial={false}
            animate={isMobileNavOpen ? "open" : "closed"}
          >
            <svg width="23" height="23" viewBox="0 0 23 23">
              <Path
                variants={{
                  closed: { d: "M 2 2.5 L 20 2.5" },
                  open: { d: "M 3 16.5 L 17 2.5" },
                }}
              />
              <Path
                d="M 2 9.423 L 20 9.423"
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
              />
              <Path
                variants={{
                  closed: { d: "M 2 16.346 L 20 16.346" },
                  open: { d: "M 3 2.5 L 17 16.346" },
                }}
              />
            </svg>
          </motion.div>
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

const Path = (props: any) => (
  <motion.path
    className="stroke-current text-gray-200"
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

export default memo(LayoutHeader);
