import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { NavRoutes } from "interfaces/nav-routes";
import { IntlFormatProps } from "@hooks/use-intl";
import GameSelector from "./GameSelector";
import type { GameProps } from "@utils/games";

type Props = {
  isOpen: boolean;
  navroutes: NavRoutes[];
  game: GameProps;
  handleClick: (value: boolean) => void;
  f: (props: IntlFormatProps) => string;
};

const MobileNav = ({ isOpen, navroutes, game, handleClick, f }: Props) => {
  const variants = {
    open: {
      transition: { staggerChildren: 0.01, delayChildren: 0.1 },
    },
    closed: {
      transition: { staggerChildren: 0, staggerDirection: 0 },
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
        "absolute top-12 left-0 z-20 flex w-full flex-col items-center bg-vulcan-800/95 p-7 pt-0 text-gray-400 transition-all lg:hidden",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <GameSelector currentGame={game} className="my-4 block md:hidden" />
      <h2 className="mb-5 text-lg text-tof-50">Navigation</h2>
      <motion.ul
        className="flex flex-row flex-wrap items-center"
        variants={variants}
      >
        {navroutes.map((r) => (
          <Fragment key={r.name}>
            {r.href !== "/#" && (
              <motion.li className="m-0 flex w-1/2 p-3" variants={variantsli}>
                <Link href={r.href}>
                  <a className="mobile-link" onClick={() => handleClick(false)}>
                    {f({ id: r.id, defaultMessage: r.name })}
                  </a>
                </Link>
              </motion.li>
            )}
            {r.dropdownMenu &&
              r.dropdownMenu
                .filter((d) => d.href !== "/#")
                .map((rd) => (
                  <motion.li
                    key={rd.name}
                    className="m-0 flex w-1/2 p-3"
                    variants={variantsli}
                  >
                    <Link href={rd.href}>
                      <a
                        className="mobile-link"
                        onClick={() => handleClick(false)}
                      >
                        {f({ id: rd.id, defaultMessage: rd.name })}
                      </a>
                    </Link>
                  </motion.li>
                ))}
          </Fragment>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default MobileNav;
