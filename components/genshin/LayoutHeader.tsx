import Link from "next/link";
import { memo, useState } from "react";
// import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";

// import NavLink from "../NavLink";
import Logo from "./Logo";
// import { NavRoutes } from "interfaces/nav-routes";
// import useIntl from "@hooks/use-intl";
// import GameSelector from "@components/GameSelector";
// import { GAME } from "@utils/games";

// const MobileNav = dynamic(() => import("../MobileNav"), {
//   ssr: false,
// });

const navRoutes = [
  { id: "home", name: "Home", href: "/" },
  { id: "characters", name: "Characters", href: "/characters" },
  {
    id: "tools",
    name: "Tools",
    children: [{ id: "todo", name: "Todo", href: "/todo" }],
  },
  { id: "tcg", name: "TCG Cards", href: "/tcg" },
  {
    id: "wiki",
    name: "Wiki",
    children: [
      { id: "weapons", name: "Weapons", href: "/weapons", description: '' },
      { id: "calculator", name: "Calculator", href: "/calculator" },
      { id: "guides", name: "Guides", href: "/guides" },
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
  {
    id: "banners",
    name: "Banners",
    href: "/#",
    dropdownMenu: [
      {
        id: "banners_characters",
        name: "Banners Characters",
        href: "/banners/characters",
      },
      {
        id: "banners_weapons",
        name: "Banners Weapons",
        href: "/banners/weapons",
      },
    ],
  },
];

// const navroutes: NavRoutes[] = [
//   {
//     id: "tierlist",
//     name: "Tierlist",
//     href: "/#",
//     dropdownMenu: [
//       {
//         id: "tierlist_characters",
//         name: "Tierlist Characters",
//         href: "/tier-list",
//       },
//       {
//         id: "tierlist_weapons",
//         name: "Tierlist Weapons",
//         href: "/tier-list-weapons",
//       },
//     ],
//   },
//   { id: "teams", name: "Teams", href: "/teams" },
// ];

const LayoutHeader = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b border-vulcan-700 bg-vulcan-800/70 shadow-md backdrop-blur md:border-b-0">
      <div className="mx-auto block w-full max-w-6xl items-center py-4 px-4 text-sm md:flex md:py-0 ">
        <div className="flex items-center justify-between pr-4 md:inline-block md:pr-0">
          <a href="/">
            <Logo />
          </a>
          <button
            className="z-10 rounded py-2 md:hidden"
            onClick={() => setIsMobileNavOpen((a) => !a)}
          >
            <div className="h-2 w-6 text-white text-xl">
              {isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
            </div>
          </button>
        </div>
        <div
          className={clsx(
            "absolute left-0 z-10 mt-4 block max-h-[80vh] w-screen overflow-auto bg-vulcan-800 py-4 md:relative md:ml-10 md:mt-0 md:flex md:flex-grow md:justify-between md:overflow-visible md:bg-transparent md:py-0",
            { hidden: !isMobileNavOpen }
          )}
        >
          <ul className="flex flex-col md:flex-row">
            {navRoutes.map((route) => (
              <li key={route.id} className="group relative md:py-4">
                {!route.children ? (
                  <Link
                    className="ml-4 mt-4 block font-semibold text-slate-300 md:mt-0 md:ml-0 md:py-2 md:px-3"
                    href={route.href}
                  >
                    {route.name}
                  </Link>
                ) : (
                  <>
                    <span className="mt-6 ml-4 block cursor-default text-xs font-semibold uppercase text-slate-500 md:ml-0 md:mt-0 md:mr-1 md:inline-block md:py-2 md:px-3 md:text-sm md:normal-case md:text-slate-300">
                      {route.name}
                    </span>
                    <div
                      className={clsx(
                        "transform px-0 text-xs transition-all md:pointer-events-auto md:absolute md:z-10 md:mt-4 md:ml-0 md:-translate-y-1 md:px-0  md:opacity-0 group-hover:md:pointer-events-none group-hover:md:-translate-y-0 group-hover:md:opacity-100"
                      )}
                    >
                      <div className="mt-2 max-h-[calc(100vh-80px)] min-w-[140px] overflow-y-auto overflow-x-hidden border border-vulcan-900 md:mt-0 md:w-[1040px] md:max-w-[calc(100vw-176px)] md:rounded-sm md:bg-vulcan-800 md:shadow-xl">
                        <div className="px-4 pb-3 md:pt-6">
                          <p className="hidden px-4 text-xs font-semibold uppercase text-slate-500 md:block">
                            Workflow
                          </p>
                          <div className="grid gap-0 md:grid-cols-2">
                            {route.children.map((child) => (
                              <Link
                                key={child.id}
                                className="mb-2 flex items-center rounded-sm border border-transparent text-sm text-slate-200 transition-colors md:mb-0 md:ml-0 md:items-start md:p-4 md:transition-none"
                                href={child.href}
                              >
                                <div className="mr-1 scale-75 transform rounded bg-vulcan-600 p-2 md:mr-4 md:scale-100 md:p-3"></div>
                                <div>
                                  <p className="mb-0 leading-4 md:font-semibold">
                                    {child.name}
                                  </p>
                                  <p className="mt-0.5 hidden text-[0.8125rem] text-slate-500 md:block">
                                    {child.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// const LayoutHeader = () => {
//   const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
//   const router = useRouter();
//   const { t } = useIntl("layout");
//   return (
//     <nav className="sticky top-0 z-40 h-12 border-b border-gray-700 border-opacity-60 bg-vulcan-800/70 shadow-md backdrop-blur">
//       <div className="container mx-auto mb-12 flex h-full text-gray-400 ">
//         <Link
//           href="/"
//           className="mr-6 flex items-center font-bold"
//           aria-current="page"
//         >
//           <Logo />
//         </Link>
//         <GameSelector currentGame={GAME.GENSHIN} className="hidden md:block" />
//         <ul className="ml-auto hidden lg:flex">
//           {navroutes.map((r) => (
//             <NavLink
//               key={r.name}
//               href={r.href}
//               route={router.route}
//               dropdownMenu={r.dropdownMenu?.map((d) => ({
//                 ...d,
//                 name: t({ id: d.id, defaultMessage: d.name }),
//               }))}
//             >
//               {t({ id: r.id, defaultMessage: r.name })}
//             </NavLink>
//           ))}
//         </ul>
//         <div
//           className="z-50 m-0 ml-auto flex cursor-pointer items-center overflow-visible p-6 lg:hidden"
//           onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
//         >
//           <div>{isMobileNavOpen ? <AiOutlineClose /> : <AiOutlineMenu />}</div>
//         </div>
//       </div>
//       <MobileNav
//         isOpen={isMobileNavOpen}
//         navroutes={navroutes}
//         game={GAME.GENSHIN}
//         handleClick={setIsMobileNavOpen}
//         f={t}
//       />
//     </nav>
//   );
// };

export default memo(LayoutHeader);
