import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { NavRoutes } from "interfaces/nav-routes";
import { IntlFormatProps } from "@hooks/use-intl";

type Props = {
  isOpen: boolean;
  navroutes: NavRoutes[];
  handleClick: (value: boolean) => void;
  f: (props: IntlFormatProps) => string;
};

const MobileNav = ({ isOpen, navroutes, handleClick, f }: Props) => {
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
        {navroutes
          .filter((r) => r.href !== "/#")
          .map((r) => (
            <Fragment key={r.name}>
              <motion.li className="flex w-1/2 m-0 p-3" variants={variantsli}>
                <Link href={r.href}>
                  <a className="mobile-link" onClick={() => handleClick(false)}>
                    {f({ id: r.id, defaultMessage: r.name })}
                  </a>
                </Link>
              </motion.li>
              {r.dropdownMenu &&
                r.dropdownMenu
                  .filter((d) => d.href !== "/#")
                  .map((rd) => (
                    <motion.li
                      key={rd.name}
                      className="flex w-1/2 m-0 p-3"
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
