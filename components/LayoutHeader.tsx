import Link from "next/link";
import { SidebarLink } from "./SidebarLink";

import { IoIosBuild, IoIosPeople } from "react-icons/io";
import { GiBroadsword, GiEvilBud } from "react-icons/gi";

interface LayoutHeaderProps {}

export const LayoutHeader: React.FC<LayoutHeaderProps> = () => {
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-vulcan-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-400">
        <Link href="/">
          <a className="ml-6 text-lg font-bold text-gray-200">Genshin Builds</a>
        </Link>
        <ul className="mt-6">
          <SidebarLink href="/comp-builder" icon={<IoIosBuild />}>
            Team Builder
          </SidebarLink>
          <SidebarLink href="/characters" icon={<IoIosPeople />}>
            Characters
          </SidebarLink>
          <SidebarLink href="/weapons" icon={<GiBroadsword />}>
            Weapons
          </SidebarLink>
          <SidebarLink href="/artifacts" icon={<GiEvilBud />}>
            Artifacts
          </SidebarLink>
        </ul>
        {/* <ul>
          <li className="relative px-6 py-3">
            <a
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200"
              href="forms.html"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">Forms</span>
            </a>
          </li>
          <li className="relative px-6 py-3">
            <a
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200"
              href="cards.html"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="ml-4">Cards</span>
            </a>
          </li>
        </ul> */}
      </div>
    </aside>
  );
};
