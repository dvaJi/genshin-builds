import { Fragment, memo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NavLink from "./NavLink";
import clsx from "clsx";
import { motion } from "framer-motion";
import Logo from "./Logo";

interface NavRoutes {
  name: string;
  href: string;
  dropdownMenu?: NavRoutes[];
}

const navroutes: NavRoutes[] = [
  { name: "Characters", href: "/characters" },
  // // { name: "Tierlist", href: "/tierlist" },
  {
    name: "Database",
    href: "/#",
    dropdownMenu: [
      { name: "Weapons", href: "/weapons" },
      // { name: "Artifacts", href: "/artifacts" },
    ],
  },
  // { name: "Team Builder", href: "/comp-builder" },
];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const router = useRouter();
  return (
    <nav className="sticky top-0 h-12 mb-5 z-40 bg-vulcan-800 border-b border-gray-800 shadow-md">
      <div className="flex h-full mb-12 mx-auto container text-gray-400 ">
        <a
          className="flex items-center font-bold mr-6"
          aria-current="page"
          href="/"
        >
          <Logo className="w-20 mr-5 fill-current text-white" />
          <span className="text-gray-100 text-lg font-normal">
            GenshinBuilds
          </span>
        </a>
        <ul className="ml-auto hidden lg:flex">
          {navroutes.map((r) => (
            <NavLink
              key={r.href}
              href={r.href}
              route={router.route}
              dropdownMenu={r.dropdownMenu}
            >
              {r.name}
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
      <MobileNav isOpen={isMobileNavOpen} />
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

const MobileNav = ({ isOpen }: { isOpen: boolean }) => {
  const variants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const variantsli = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  return (
    <motion.div
      className={clsx(
        "bg-vulcan-800 text-gray-400 transition-all p-7 flex absolute top-12 left-0 flex-col items-center w-full z-20 opacity-0 pointer-events-none lg:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : ""
      )}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <h2 className="text-lg mb-5">Navigation</h2>
      <motion.ul
        className="flex items-center flex-row flex-wrap"
        variants={variants}
      >
        {navroutes.map((r) => (
          <Fragment key={r.name}>
            <motion.li className="flex w-1/2 m-0 p-3" variants={variantsli}>
              <Link href={r.href}>
                <a className="mobile-link">{r.name}</a>
              </Link>
            </motion.li>
            {r.dropdownMenu &&
              r.dropdownMenu.map((rd) => (
                <motion.li
                  key={rd.name}
                  className="flex w-1/2 m-0 p-3"
                  variants={variantsli}
                >
                  <Link href={rd.href}>
                    <a className="mobile-link">{rd.name}</a>
                  </Link>
                </motion.li>
              ))}
          </Fragment>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default memo(LayoutHeader);
